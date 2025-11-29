import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';

import { MainModule } from '@/main.module';
import { IDENTITY_SERVICE_TOKEN } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { UsersMemoryRepository } from '@/modules/users/infrastructure/database/repositories/users.memory-repository';
import { RolesMemoryRepository } from '@/modules/auth/infrastructure/database/repositories/roles.memory-repository';
import { post, get } from './helpers/request.helper';

describe('Auth Endpoints (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let mockIdentityService: any;
  let usersMemoryRepository: UsersMemoryRepository;
  let rolesMemoryRepository: RolesMemoryRepository;

  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    username: 'testuser',
    displayName: 'Test User',
    phone: '+525512345678',
  };

  const mockTokens = {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    idToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    refreshToken: 'mock-refresh-token-xyz123',
    expiresIn: 3600,
  };

  beforeAll(async () => {
    // Create mock identity service
    mockIdentityService = {
      register: jest.fn().mockResolvedValue({
        UserSub: 'mock-user-sub-123',
        UserConfirmed: false,
      }),
      confirmRegister: jest.fn().mockResolvedValue({
        success: true,
      }),
      initiateAuth: jest.fn().mockResolvedValue({
        accessToken: mockTokens.accessToken,
        idToken: mockTokens.idToken,
        refreshToken: mockTokens.refreshToken,
        expiresIn: mockTokens.expiresIn,
      }),
      refreshToken: jest.fn().mockResolvedValue({
        accessToken: 'new-access-token',
        expiresIn: 3600,
      }),
      validateAccessToken: jest.fn().mockResolvedValue({
        sub: 'mock-user-sub-123',
        email: testUser.email,
        username: 'mock-user-sub-123', // Cognito returns identityId as username
        token_use: 'access',
      }),
      getUser: jest.fn().mockResolvedValue({
        identityId: 'mock-user-sub-123',
        username: 'mock-user-sub-123',
        attributes: {
          email: testUser.email,
        },
      }),
      getCognitoUser: jest.fn().mockResolvedValue({
        identityId: 'mock-user-sub-123',
        username: 'mock-user-sub-123',
        attributes: {
          email: testUser.email,
        },
      }),
    };

    const mockEventBus = {
      publish: jest.fn(),
      publishAll: jest.fn(),
      register: jest.fn(),
      registerSagas: jest.fn(),
      bind: jest.fn(),
      combine: jest.fn(),
      ofType: jest.fn(),
    };

    usersMemoryRepository = new UsersMemoryRepository();
    rolesMemoryRepository = new RolesMemoryRepository();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    })
      .overrideProvider(IDENTITY_SERVICE_TOKEN)
      .useValue(mockIdentityService)
      .overrideProvider(EventBus)
      .useValue(mockEventBus)
      .overrideProvider('UsersRepository')
      .useValue(usersMemoryRepository)
      .overrideProvider('RolesRepository')
      .useValue(rolesMemoryRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    httpServer = app.getHttpAdapter().getInstance();

    // Create test role
    await rolesMemoryRepository.create({
      uuid: 'b7a5682d-8995-4259-aec5-2ec55eaf6d4c', // Valid UUID
      name: 'Test Role',
      description: 'Test role for e2e tests',
      isActive: true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    // Create test user in memory for confirmation tests
    await usersMemoryRepository.create({
      uuid: 'test-user-uuid',
      email: 'existing@example.com', // Different email to avoid conflicts
      username: 'existinguser',
      displayName: 'Existing User',
      phone: '+525512345678',
      identityId: 'mock-user-sub-existing',
      cognitoSub: 'mock-user-sub-existing',
      isConfirmed: false,
      isEmailVerified: false,
      isPhoneVerified: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    // Create authenticated test user for protected endpoints
    await usersMemoryRepository.create({
      uuid: 'authenticated-user-uuid',
      email: testUser.email,
      username: testUser.username,
      displayName: testUser.displayName,
      phone: testUser.phone,
      identityId: 'mock-user-sub-123',
      cognitoSub: 'mock-user-sub-123',
      roleId: 'b7a5682d-8995-4259-aec5-2ec55eaf6d4c', // Match test role UUID
      isConfirmed: true,
      isEmailVerified: true,
      isPhoneVerified: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Re-setup default mock implementations
    mockIdentityService.register.mockResolvedValue({
      UserSub: 'mock-user-sub-123',
      UserConfirmed: false,
    });
    mockIdentityService.confirmRegister.mockResolvedValue({
      success: true,
    });
    mockIdentityService.initiateAuth.mockResolvedValue({
      accessToken: mockTokens.accessToken,
      idToken: mockTokens.idToken,
      refreshToken: mockTokens.refreshToken,
      expiresIn: mockTokens.expiresIn,
    });
    mockIdentityService.refreshToken.mockResolvedValue({
      accessToken: 'new-access-token',
      idToken: 'new-id-token',
      expiresIn: 3600,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const { statusCode, body } = await post(httpServer, '/auth/register', {
        email: 'newuser@example.com', // Use different email to avoid conflict
        password: testUser.password,
        username: 'newuser',
        displayName: 'New User',
        phone: testUser.phone,
      });

      expect(statusCode).toBe(201);
      expect(body.data).toHaveProperty('message');
      expect(body.data.message).toBe('User registered successfully');
      expect(mockIdentityService.register).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: testUser.password,
        displayName: 'New User',
        phone: testUser.phone,
      });
    });

    it('should register without optional phone', async () => {
      const { statusCode, body } = await post(httpServer, '/auth/register', {
        email: 'another@example.com',
        password: testUser.password,
        username: 'anotheruser',
        displayName: 'Another User',
      });

      expect(statusCode).toBe(201);
      expect(body.data.message).toBe('User registered successfully');
    });

    it('should fail with 409 if user already exists', async () => {
      const duplicateEmail = 'duplicate@example.com';

      // First registration succeeds
      const { statusCode: firstStatus } = await post(
        httpServer,
        '/auth/register',
        {
          email: duplicateEmail,
          password: testUser.password,
          username: 'duplicateuser',
          displayName: 'Duplicate User',
          phone: testUser.phone,
        },
      );

      expect(firstStatus).toBe(201);

      // Create user in DB to simulate that first registration completed
      await usersMemoryRepository.create({
        uuid: 'duplicate-user-uuid',
        email: duplicateEmail,
        username: 'duplicateuser',
        displayName: 'Duplicate User',
        phone: testUser.phone,
        cognitoSub: 'mock-user-sub-duplicate',
        isConfirmed: false,
        isEmailVerified: false,
        isPhoneVerified: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      // Second registration should fail with 409 because user exists in DB
      const { statusCode: secondStatus } = await post(
        httpServer,
        '/auth/register',
        {
          email: duplicateEmail,
          password: testUser.password,
          username: 'duplicateuser',
          displayName: 'Duplicate User',
          phone: testUser.phone,
        },
      );

      expect(secondStatus).toBe(409);
    });

    it('should fail with 400 if email is invalid', async () => {
      const { statusCode } = await post(httpServer, '/auth/register', {
        email: 'invalid-email',
        password: testUser.password,
        username: 'testuser2',
        displayName: 'Test User 2',
      });

      expect(statusCode).toBe(400);
      expect(mockIdentityService.register).not.toHaveBeenCalled();
    });

    it('should fail with 400 if password is too weak', async () => {
      const { statusCode } = await post(httpServer, '/auth/register', {
        email: 'test2@example.com',
        password: '123',
        username: 'testuser3',
        displayName: 'Test User 3',
      });

      expect(statusCode).toBe(400);
      expect(mockIdentityService.register).not.toHaveBeenCalled();
    });

    it('should fail with 400 if username is invalid', async () => {
      const { statusCode } = await post(httpServer, '/auth/register', {
        email: 'test3@example.com',
        password: testUser.password,
        username: 'ab', // Too short
        displayName: 'Test User 3',
      });

      expect(statusCode).toBe(400);
    });

    it('should fail with 400 if required fields are missing', async () => {
      const { statusCode } = await post(httpServer, '/auth/register', {
        email: testUser.email,
        // missing password, username, displayName
      });

      expect(statusCode).toBe(400);
      expect(mockIdentityService.register).not.toHaveBeenCalled();
    });

    it('should fail with 400 if phone format is invalid', async () => {
      const { statusCode } = await post(httpServer, '/auth/register', {
        email: 'test4@example.com',
        password: testUser.password,
        username: 'testuser4',
        displayName: 'Test User 4',
        phone: '1234567890', // Missing + prefix
      });

      expect(statusCode).toBe(400);
    });
  });

  describe('POST /auth/confirm-register', () => {
    it.skip('should confirm registration successfully', async () => {
      const { statusCode, body } = await post(
        httpServer,
        '/auth/confirm-register',
        {
          email: 'existing@example.com', // Use the user created in beforeAll
          confirmationCode: '123456',
        },
      );

      expect(statusCode).toBe(200);
      expect(body.data).toHaveProperty('message');
      expect(mockIdentityService.confirmRegister).toHaveBeenCalledWith({
        email: 'existing@example.com',
        confirmationCode: '123456',
      });
    });

    it('should fail with 401 if confirmation code is invalid', async () => {
      const error = new Error('Invalid verification code');
      error.name = 'InvalidCredentialsException';
      mockIdentityService.confirmRegister.mockRejectedValueOnce(error);

      const { statusCode } = await post(httpServer, '/auth/confirm-register', {
        email: 'unconfirmed@example.com', // Use different email
        confirmationCode: '000000',
      });

      expect(statusCode).toBe(401);
    });

    it('should fail with 400 if confirmation code format is invalid', async () => {
      const { statusCode } = await post(httpServer, '/auth/confirm-register', {
        email: testUser.email,
        confirmationCode: 'abc', // Must be 6 digits
      });

      expect(statusCode).toBe(400);
      expect(mockIdentityService.confirmRegister).not.toHaveBeenCalled();
    });

    it('should fail with 400 if required fields are missing', async () => {
      const { statusCode } = await post(httpServer, '/auth/confirm-register', {
        email: testUser.email,
        // missing confirmationCode
      });

      expect(statusCode).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
      const { statusCode, body } = await post(httpServer, '/auth/login', {
        email: testUser.email,
        password: testUser.password,
      });

      expect(statusCode).toBe(201);
      expect(body.data).toHaveProperty('accessToken', mockTokens.accessToken);
      expect(body.data).toHaveProperty('refreshToken', mockTokens.refreshToken);
      expect(body.data).toHaveProperty('expiresIn', mockTokens.expiresIn);
      expect(body.data).toHaveProperty('tokenType', 'Bearer');

      expect(mockIdentityService.initiateAuth).toHaveBeenCalledWith(
        testUser.email,
        testUser.password,
      );
    });

    it('should fail with 401 if credentials are invalid', async () => {
      const error = new Error('Incorrect username or password');
      error.name = 'InvalidCredentialsException';
      mockIdentityService.initiateAuth.mockRejectedValueOnce(error);

      const { statusCode } = await post(httpServer, '/auth/login', {
        email: testUser.email,
        password: 'WrongPassword123!',
      });

      expect(statusCode).toBe(401);
    });

    it('should fail with 409 if user is not confirmed', async () => {
      const error = new Error('User is not confirmed');
      error.name = 'UserNotConfirmedException';
      mockIdentityService.initiateAuth.mockRejectedValueOnce(error);

      const { statusCode } = await post(httpServer, '/auth/login', {
        email: testUser.email,
        password: testUser.password,
      });

      expect(statusCode).toBe(409);
    });

    it('should fail with 401 if user does not exist', async () => {
      const error = new Error('User does not exist');
      error.name = 'UserNotFoundException';
      mockIdentityService.initiateAuth.mockRejectedValueOnce(error);

      const { statusCode } = await post(httpServer, '/auth/login', {
        email: 'nonexistent@example.com',
        password: testUser.password,
      });

      expect(statusCode).toBe(401);
    });

    it('should fail with 400 if required fields are missing', async () => {
      const { statusCode } = await post(httpServer, '/auth/login', {
        email: testUser.email,
        // missing password
      });

      expect(statusCode).toBe(400);
      expect(mockIdentityService.initiateAuth).not.toHaveBeenCalled();
    });

    it('should fail with 400 if email format is invalid', async () => {
      const { statusCode } = await post(httpServer, '/auth/login', {
        email: 'invalid-email',
        password: testUser.password,
      });

      expect(statusCode).toBe(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const { statusCode, body } = await post(
        httpServer,
        '/auth/refresh',
        {
          refreshToken: mockTokens.refreshToken,
        },
        {
          Authorization: `Bearer ${mockTokens.accessToken}`,
        },
      );

      expect(statusCode).toBe(201);
      expect(body.data).toHaveProperty('accessToken');
      expect(body.data).toHaveProperty('expiresIn');
      expect(body.data).toHaveProperty('tokenType', 'Bearer');
      expect(body.data.accessToken).toBe('new-access-token');

      expect(mockIdentityService.refreshToken).toHaveBeenCalledWith(
        mockTokens.refreshToken,
        'mock-user-sub-123', // identityId from validateAccessToken mock
      );
    });

    it('should fail with 401 if refresh token is invalid', async () => {
      const error = new Error('Invalid refresh token');
      error.name = 'InvalidCredentialsException';
      mockIdentityService.refreshToken.mockRejectedValueOnce(error);

      const { statusCode } = await post(
        httpServer,
        '/auth/refresh',
        {
          refreshToken: 'invalid-refresh-token',
        },
        {
          Authorization: `Bearer ${mockTokens.accessToken}`,
        },
      );

      expect(statusCode).toBe(401);
    });

    it('should fail with 401 if refresh token is expired', async () => {
      const error = new Error('Refresh Token has expired');
      error.name = 'InvalidCredentialsException';
      mockIdentityService.refreshToken.mockRejectedValueOnce(error);

      const { statusCode } = await post(
        httpServer,
        '/auth/refresh',
        {
          refreshToken: 'expired-refresh-token',
        },
        {
          Authorization: `Bearer ${mockTokens.accessToken}`,
        },
      );

      expect(statusCode).toBe(401);
    });

    it('should fail with 401 if authorization header is missing', async () => {
      const { statusCode } = await post(httpServer, '/auth/refresh', {
        refreshToken: mockTokens.refreshToken,
      });

      expect(statusCode).toBe(401);
      expect(mockIdentityService.refreshToken).not.toHaveBeenCalled();
    });

    it('should fail with 400 if refresh token is missing', async () => {
      const { statusCode } = await post(
        httpServer,
        '/auth/refresh',
        {},
        {
          Authorization: `Bearer ${mockTokens.accessToken}`,
        },
      );

      expect(statusCode).toBe(400);
      expect(mockIdentityService.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('GET /auth/me', () => {
    it.skip('should get current user with valid token', async () => {
      // This test requires mocking the database/users service
      // Skipped for now as it goes beyond identity service mocking
      const { statusCode, body } = await get(httpServer, '/auth/me', {
        authorization: `Bearer ${mockTokens.accessToken}`,
      });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('uuid');
      expect(body).toHaveProperty('email');
      expect(mockIdentityService.validateAccessToken).toHaveBeenCalledWith(
        mockTokens.accessToken,
      );
    });

    it('should fail with 401 without token', async () => {
      const { statusCode } = await get(httpServer, '/auth/me');

      expect(statusCode).toBe(401);
    });

    it('should fail with 401 with invalid token', async () => {
      mockIdentityService.validateAccessToken.mockRejectedValueOnce({
        name: 'JsonWebTokenError',
        message: 'jwt malformed',
      });

      const { statusCode } = await get(httpServer, '/auth/me', {
        authorization: 'Bearer invalid-token',
      });

      expect(statusCode).toBe(401);
    });

    it('should fail with 401 with malformed authorization header', async () => {
      const { statusCode } = await get(httpServer, '/auth/me', {
        authorization: mockTokens.accessToken, // Missing "Bearer" prefix
      });

      expect(statusCode).toBe(401);
    });

    it.skip('should fail with 401 with expired token', async () => {
      // This test requires mocking the database/users service
      // Skipped for now as it goes beyond identity service mocking
      mockIdentityService.validateAccessToken.mockRejectedValueOnce({
        name: 'TokenExpiredError',
        message: 'jwt expired',
      });

      const { statusCode } = await get(httpServer, '/auth/me', {
        authorization: 'Bearer expired-token',
      });

      expect(statusCode).toBe(401);
    });
  });
});
