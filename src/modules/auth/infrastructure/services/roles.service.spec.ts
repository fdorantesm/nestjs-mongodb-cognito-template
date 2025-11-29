import { Test, TestingModule } from '@nestjs/testing';

import { RolesService } from './roles.service';
import { RolesMemoryRepository } from '@/modules/auth/infrastructure/database/repositories/roles.memory-repository';
import { ROLES_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/roles.repository.interface';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import { RoleEntity } from '@/modules/auth/domain/entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;
  let repository: RolesMemoryRepository;

  const mockRole: Role = {
    uuid: 'role-uuid-123',
    name: 'Admin',
    code: 'admin',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: ROLES_REPOSITORY_TOKEN,
          useClass: RolesMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<RolesMemoryRepository>(ROLES_REPOSITORY_TOKEN);
  });

  afterEach(async () => {
    await repository.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a role successfully', async () => {
      const role = await service.create(mockRole);

      expect(role).toBeInstanceOf(RoleEntity);
      expect(role.getName()).toBe(mockRole.name);
      expect(role.getCode()).toBe(mockRole.code);
    });

    it('should create multiple roles', async () => {
      const role1 = await service.create(mockRole);
      const role2 = await service.create({
        ...mockRole,
        uuid: 'role-uuid-456',
        name: 'User',
        code: 'user',
      });

      expect(role1.getName()).toBe('Admin');
      expect(role2.getName()).toBe('User');
    });
  });

  describe('findById', () => {
    it('should find a role by uuid', async () => {
      await service.create(mockRole);
      const role = await service.findById(mockRole.uuid);

      expect(role).toBeInstanceOf(RoleEntity);
      expect(role.getUuid()).toBe(mockRole.uuid);
      expect(role.getName()).toBe(mockRole.name);
    });

    it('should return null if role not found', async () => {
      const role = await service.findById('non-existent-uuid');
      expect(role).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should find a role by name', async () => {
      await service.create(mockRole);
      const role = await service.findOne({ name: mockRole.name });

      expect(role).toBeInstanceOf(RoleEntity);
      expect(role.getName()).toBe(mockRole.name);
    });

    it('should return null if role not found', async () => {
      const role = await service.findOne({ name: 'NonExistent' });
      expect(role).toBeUndefined();
    });
  });

  describe('find', () => {
    it('should return all roles', async () => {
      await service.create(mockRole);
      await service.create({
        ...mockRole,
        uuid: 'role-uuid-456',
        name: 'User',
        code: 'user',
      });

      const roles = await service.find();
      expect(roles).toHaveLength(2);
      expect(roles[0]).toBeInstanceOf(RoleEntity);
    });

    it('should filter roles by criteria', async () => {
      await service.create(mockRole);
      await service.create({
        ...mockRole,
        uuid: 'role-uuid-456',
        name: 'User',
        code: 'user',
      });

      const roles = await service.find({ code: 'user' });
      expect(roles).toHaveLength(1);
      expect(roles[0].getName()).toBe('User');
    });
  });

  describe('update', () => {
    it('should update a role successfully', async () => {
      await service.create(mockRole);
      const updatedRole = await service.update(
        { uuid: mockRole.uuid },
        { name: 'SuperAdmin', code: 'superadmin' },
      );

      expect(updatedRole).toBeInstanceOf(RoleEntity);
      expect(updatedRole.getName()).toBe('SuperAdmin');
      expect(updatedRole.getCode()).toBe('superadmin');
    });

    it('should update role code', async () => {
      await service.create(mockRole);
      const updatedRole = await service.update(
        { uuid: mockRole.uuid },
        { code: 'administrator' },
      );

      expect(updatedRole.getCode()).toBe('administrator');
    });
  });

  describe('delete', () => {
    it('should delete a role successfully', async () => {
      await service.create(mockRole);
      const result = await service.delete({ uuid: mockRole.uuid });

      expect(result).toBe(true);

      const role = await service.findById(mockRole.uuid);
      expect(role).toBeUndefined();
    });
  });

  describe('count', () => {
    it('should count all roles', async () => {
      await service.create(mockRole);
      await service.create({
        ...mockRole,
        uuid: 'role-uuid-456',
        name: 'User',
        code: 'user',
      });

      const count = await service.count();
      expect(count).toBe(2);
    });

    it('should count roles by criteria', async () => {
      await service.create(mockRole);
      await service.create({
        ...mockRole,
        uuid: 'role-uuid-456',
        name: 'User',
        code: 'user',
      });

      const count = await service.count({ code: 'admin' });
      expect(count).toBe(1);
    });
  });

  describe('exists', () => {
    it('should return true if role exists', async () => {
      await service.create(mockRole);
      const exists = await service.exists({ name: mockRole.name });
      expect(exists).toBe(true);
    });

    it('should return false if role does not exist', async () => {
      const exists = await service.exists({ name: 'NonExistent' });
      expect(exists).toBe(false);
    });
  });
});
