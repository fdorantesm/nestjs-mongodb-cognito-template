import { Test, TestingModule } from '@nestjs/testing';

import { UsersMemoryRepository } from '@/modules/users/infrastructure/database/repositories/users.memory-repository';
import { USERS_REPOSITORY_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import type { User } from '@/modules/users/domain/interfaces/user.interface';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { UsersService } from '@/modules/users/infrastructure/services/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersMemoryRepository;

  const mockUser: User = {
    uuid: 'test-uuid-123',
    email: 'test@example.com',
    username: 'testuser',
    identityId: 'cognito-sub-123',
    roleId: 'role-uuid-123',
    scopes: ['user'],
    isConfirmed: false,
    isEmailVerified: false,
    isPhoneVerified: false,
    isVerified: false,
    isDeleted: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY_TOKEN,
          useClass: UsersMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersMemoryRepository>(USERS_REPOSITORY_TOKEN);
  });

  afterEach(async () => {
    // Clean up repository after each test
    await repository.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const user = await service.create(mockUser);

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.getEmail()).toBe(mockUser.email);
      expect(user.getIdentityId()).toBe(mockUser.identityId);
    });

    it('should create multiple users', async () => {
      const user1 = await service.create(mockUser);
      const user2 = await service.create({
        ...mockUser,
        uuid: 'test-uuid-456',
        email: 'test2@example.com',
        username: 'testuser2',
      });

      expect(user1.getEmail()).toBe(mockUser.email);
      expect(user2.getEmail()).toBe('test2@example.com');
    });
  });

  describe('findById', () => {
    it('should find a user by uuid', async () => {
      await service.create(mockUser);
      const user = await service.findById(mockUser.uuid);

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.getUuid()).toBe(mockUser.uuid);
      expect(user.getEmail()).toBe(mockUser.email);
    });

    it('should return null if user not found', async () => {
      const user = await service.findById('non-existent-uuid');
      expect(user).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should find a user by email', async () => {
      await service.create(mockUser);
      const user = await service.findOne({ email: mockUser.email });

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.getEmail()).toBe(mockUser.email);
    });

    it('should find a user by username', async () => {
      await service.create(mockUser);
      const user = await service.findOne({ username: mockUser.username });

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.toJson().username).toBe(mockUser.username);
    });

    it('should return null if user not found', async () => {
      const user = await service.findOne({ email: 'nonexistent@example.com' });
      expect(user).toBeUndefined();
    });
  });

  describe('find', () => {
    it('should return all users', async () => {
      await service.create(mockUser);
      await service.create({
        ...mockUser,
        uuid: 'test-uuid-456',
        email: 'test2@example.com',
        username: 'testuser2',
      });

      const users = await service.find();
      expect(users).toHaveLength(2);
      expect(users[0]).toBeInstanceOf(UserEntity);
    });

    it('should filter users by criteria', async () => {
      await service.create(mockUser);
      await service.create({
        ...mockUser,
        uuid: 'test-uuid-456',
        email: 'test2@example.com',
        username: 'testuser2',
        isConfirmed: true,
      });

      const confirmedUsers = await service.find({ isConfirmed: true });
      expect(confirmedUsers).toHaveLength(1);
      expect(confirmedUsers[0].getEmail()).toBe('test2@example.com');
    });

    it('should return empty array if no users match', async () => {
      const users = await service.find({ isConfirmed: true });
      expect(users).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      await service.create(mockUser);
      const updatedUser = await service.update(
        { uuid: mockUser.uuid },
        { username: 'updateduser', isConfirmed: true },
      );

      expect(updatedUser).toBeInstanceOf(UserEntity);
      expect(updatedUser.toJson().username).toBe('updateduser');
      expect(updatedUser.toJson().isConfirmed).toBe(true);
    });

    it('should update user by email', async () => {
      await service.create(mockUser);
      const updatedUser = await service.update(
        { email: mockUser.email },
        { isEmailVerified: true },
      );

      expect(updatedUser.toJson().isEmailVerified).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      await service.create(mockUser);
      const result = await service.delete({ uuid: mockUser.uuid });

      expect(result).toBe(true);

      const user = await service.findById(mockUser.uuid);
      expect(user).toBeUndefined();
    });

    it('should return false if user not found', async () => {
      const result = await service.delete({ uuid: 'non-existent-uuid' });
      expect(result).toBe(false);
    });
  });

  describe('count', () => {
    it('should count all users', async () => {
      await service.create(mockUser);
      await service.create({
        ...mockUser,
        uuid: 'test-uuid-456',
        email: 'test2@example.com',
        username: 'testuser2',
      });

      const count = await service.count();
      expect(count).toBe(2);
    });

    it('should count users with filter', async () => {
      await service.create(mockUser);
      await service.create({
        ...mockUser,
        uuid: 'test-uuid-456',
        email: 'test2@example.com',
        username: 'testuser2',
        isConfirmed: true,
      });

      const count = await service.count({ isConfirmed: true });
      expect(count).toBe(1);
    });

    it('should return 0 if no users match', async () => {
      const count = await service.count({ isConfirmed: true });
      expect(count).toBe(0);
    });
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      await service.create(mockUser);
      const exists = await service.exists({ email: mockUser.email });
      expect(exists).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      const exists = await service.exists({ email: 'nonexistent@example.com' });
      expect(exists).toBe(false);
    });
  });

  describe('createMany', () => {
    it('should create multiple users at once', async () => {
      const users = await service.createMany([
        mockUser,
        {
          ...mockUser,
          uuid: 'test-uuid-456',
          email: 'test2@example.com',
          username: 'testuser2',
        },
      ]);

      expect(users).toHaveLength(2);
      expect(users[0]).toBeInstanceOf(UserEntity);
      expect(users[1]).toBeInstanceOf(UserEntity);
    });
  });

  describe('findManyByUuids', () => {
    it('should find multiple users by uuids', async () => {
      const user1 = await service.create(mockUser);
      const user2 = await service.create({
        ...mockUser,
        uuid: 'test-uuid-456',
        email: 'test2@example.com',
        username: 'testuser2',
      });

      const users = await service.findManyByUuids([
        user1.getUuid(),
        user2.getUuid(),
      ]);

      expect(users).toHaveLength(2);
      const uuids = users.map((u) => u.getUuid());
      expect(uuids).toContain(mockUser.uuid);
      expect(uuids).toContain('test-uuid-456');
    });

    it('should return empty array if no uuids match', async () => {
      const users = await service.findManyByUuids([
        'non-existent-1',
        'non-existent-2',
      ]);
      expect(users).toEqual([]);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple users', async () => {
      await service.createMany([
        mockUser,
        {
          ...mockUser,
          uuid: 'test-uuid-456',
          email: 'test2@example.com',
          username: 'testuser2',
        },
      ]);

      const result = await service.deleteMany({});
      expect(result).toBe(true);

      const count = await service.count();
      expect(count).toBe(0);
    });

    it('should delete users matching filter', async () => {
      await service.createMany([
        mockUser,
        {
          ...mockUser,
          uuid: 'test-uuid-456',
          email: 'test2@example.com',
          username: 'testuser2',
          isConfirmed: true,
        },
      ]);

      await service.deleteMany({ isConfirmed: true });

      const count = await service.count();
      expect(count).toBe(1);
    });
  });
});
