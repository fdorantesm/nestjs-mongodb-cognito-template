import { Test, TestingModule } from '@nestjs/testing';

import { PermissionsMemoryRepository } from '@/modules/auth/infrastructure/database/repositories/permissions.memory-repository';
import { PERMISSIONS_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/permissions.repository.interface';
import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';
import { PermissionsService } from '@/modules/auth/infrastructure/services/permissions.service';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let repository: PermissionsMemoryRepository;

  const mockPermission: Permission = {
    uuid: 'permission-uuid-123',
    name: 'Users Create',
    code: 'users.create',
    description: 'Permission to create users',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PERMISSIONS_REPOSITORY_TOKEN,
          useClass: PermissionsMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    repository = module.get<PermissionsMemoryRepository>(
      PERMISSIONS_REPOSITORY_TOKEN,
    );
  });

  afterEach(async () => {
    await repository.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a permission successfully', async () => {
      const permission = await service.create(mockPermission);

      expect(permission).toBeInstanceOf(PermissionEntity);
      expect(permission.getName()).toBe(mockPermission.name);
      expect(permission.getCode()).toBe(mockPermission.code);
      expect(permission.toJson().description).toBe(
        'Permission to create users',
      );
    });

    it('should create multiple permissions', async () => {
      const permission1 = await service.create(mockPermission);
      const permission2 = await service.create({
        ...mockPermission,
        uuid: 'permission-uuid-456',
        name: 'Users Read',
        code: 'users.read',
      });

      expect(permission1.getName()).toBe('Users Create');
      expect(permission2.getName()).toBe('Users Read');
    });
  });

  describe('findById', () => {
    it('should find a permission by uuid', async () => {
      await service.create(mockPermission);
      const permission = await service.findById(mockPermission.uuid);

      expect(permission).toBeInstanceOf(PermissionEntity);
      expect(permission.getUuid()).toBe(mockPermission.uuid);
      expect(permission.getName()).toBe(mockPermission.name);
    });

    it('should return null if permission not found', async () => {
      const permission = await service.findById('non-existent-uuid');
      expect(permission).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should find a permission by name', async () => {
      await service.create(mockPermission);
      const permission = await service.findOne({ name: mockPermission.name });

      expect(permission).toBeInstanceOf(PermissionEntity);
      expect(permission.getName()).toBe(mockPermission.name);
    });

    it('should find a permission by code', async () => {
      await service.create(mockPermission);
      const permission = await service.findOne({
        code: 'users.create',
      });

      expect(permission).toBeInstanceOf(PermissionEntity);
      expect(permission.getCode()).toBe('users.create');
    });
  });

  describe('find', () => {
    it('should return all permissions', async () => {
      await service.create(mockPermission);
      await service.create({
        ...mockPermission,
        uuid: 'permission-uuid-456',
        name: 'Users Read',
        code: 'users.read',
      });

      const permissions = await service.find();
      expect(permissions).toHaveLength(2);
      expect(permissions[0]).toBeInstanceOf(PermissionEntity);
    });

    it('should filter permissions by code', async () => {
      await service.create(mockPermission);
      await service.create({
        ...mockPermission,
        uuid: 'permission-uuid-456',
        name: 'Roles Create',
        code: 'roles.create',
      });

      const userPermissions = await service.find({ code: 'users.create' });
      expect(userPermissions).toHaveLength(1);
      expect(userPermissions[0].getCode()).toBe('users.create');
    });

    it('should filter permissions by name', async () => {
      await service.create(mockPermission);
      await service.create({
        ...mockPermission,
        uuid: 'permission-uuid-456',
        name: 'Users Delete',
        code: 'users.delete',
      });

      const createPermissions = await service.find({ name: 'Users Create' });
      expect(createPermissions).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update a permission successfully', async () => {
      await service.create(mockPermission);
      const updatedPermission = await service.update(
        { uuid: mockPermission.uuid },
        { description: 'Updated description', name: 'Users Create Updated' },
      );

      expect(updatedPermission).toBeInstanceOf(PermissionEntity);
      expect(updatedPermission.toJson().description).toBe(
        'Updated description',
      );
      expect(updatedPermission.getName()).toBe('Users Create Updated');
    });

    it('should update permission code', async () => {
      await service.create(mockPermission);
      const updatedPermission = await service.update(
        { uuid: mockPermission.uuid },
        { code: 'users.create.v2' },
      );

      expect(updatedPermission.getCode()).toBe('users.create.v2');
    });
  });

  describe('delete', () => {
    it('should delete a permission successfully', async () => {
      await service.create(mockPermission);
      const result = await service.delete({ uuid: mockPermission.uuid });

      expect(result).toBe(true);

      const permission = await service.findById(mockPermission.uuid);
      expect(permission).toBeUndefined();
    });
  });

  describe('count', () => {
    it('should count all permissions', async () => {
      await service.create(mockPermission);
      await service.create({
        ...mockPermission,
        uuid: 'permission-uuid-456',
        name: 'Users Read',
        code: 'users.read',
      });

      const count = await service.count();
      expect(count).toBe(2);
    });

    it('should count permissions by code', async () => {
      await service.create(mockPermission);
      await service.create({
        ...mockPermission,
        uuid: 'permission-uuid-456',
        name: 'Roles Create',
        code: 'roles.create',
      });

      const count = await service.count({ code: 'users.create' });
      expect(count).toBe(1);
    });
  });

  describe('exists', () => {
    it('should return true if permission exists', async () => {
      await service.create(mockPermission);
      const exists = await service.exists({ name: mockPermission.name });
      expect(exists).toBe(true);
    });

    it('should return false if permission does not exist', async () => {
      const exists = await service.exists({ name: 'NonExistent' });
      expect(exists).toBe(false);
    });
  });
});
