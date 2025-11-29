import { Test, TestingModule } from '@nestjs/testing';

import { RolePermissionsMemoryRepository } from '@/modules/auth/infrastructure/database/repositories/role-permissions.memory-repository';
import { ROLE_PERMISSIONS_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.repository.interface';
import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';
import { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';
import { RolePermissionsService } from '@/modules/auth/infrastructure/services/role-permissions.service';

describe('RolePermissionsService', () => {
  let service: RolePermissionsService;
  let repository: RolePermissionsMemoryRepository;

  const mockRolePermission: RolePermission = {
    uuid: 'role-permission-uuid-123',
    roleId: 'role-uuid-123',
    permissionId: 'permission-uuid-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolePermissionsService,
        {
          provide: ROLE_PERMISSIONS_REPOSITORY_TOKEN,
          useClass: RolePermissionsMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<RolePermissionsService>(RolePermissionsService);
    repository = module.get<RolePermissionsMemoryRepository>(
      ROLE_PERMISSIONS_REPOSITORY_TOKEN,
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
    it('should create a role-permission assignment successfully', async () => {
      const rolePermission = await service.create(mockRolePermission);

      expect(rolePermission).toBeInstanceOf(RolePermissionEntity);
      expect(rolePermission.getRoleId()).toBe(mockRolePermission.roleId);
      expect(rolePermission.getPermissionId()).toBe(
        mockRolePermission.permissionId,
      );
    });

    it('should create multiple role-permission assignments', async () => {
      const rolePermission1 = await service.create(mockRolePermission);
      const rolePermission2 = await service.create({
        ...mockRolePermission,
        uuid: 'role-permission-uuid-456',
        permissionId: 'permission-uuid-456',
      });

      expect(rolePermission1.getPermissionId()).toBe(
        mockRolePermission.permissionId,
      );
      expect(rolePermission2.getPermissionId()).toBe('permission-uuid-456');
    });
  });

  describe('findById', () => {
    it('should find a role-permission by uuid', async () => {
      await service.create(mockRolePermission);
      const rolePermission = await service.findById(mockRolePermission.uuid);

      expect(rolePermission).toBeInstanceOf(RolePermissionEntity);
      expect(rolePermission.getUuid()).toBe(mockRolePermission.uuid);
      expect(rolePermission.getRoleId()).toBe(mockRolePermission.roleId);
      expect(rolePermission.getPermissionId()).toBe(
        mockRolePermission.permissionId,
      );
    });

    it('should return undefined if role-permission not found', async () => {
      const rolePermission = await service.findById('non-existent-uuid');
      expect(rolePermission).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should find a role-permission by roleId', async () => {
      await service.create(mockRolePermission);
      const rolePermission = await service.findOne({
        roleId: mockRolePermission.roleId,
      });

      expect(rolePermission).toBeInstanceOf(RolePermissionEntity);
      expect(rolePermission.getRoleId()).toBe(mockRolePermission.roleId);
    });

    it('should find a role-permission by permissionId', async () => {
      await service.create(mockRolePermission);
      const rolePermission = await service.findOne({
        permissionId: mockRolePermission.permissionId,
      });

      expect(rolePermission).toBeInstanceOf(RolePermissionEntity);
      expect(rolePermission.getPermissionId()).toBe(
        mockRolePermission.permissionId,
      );
    });

    it('should find a role-permission by roleId and permissionId', async () => {
      await service.create(mockRolePermission);
      const rolePermission = await service.findOne({
        roleId: mockRolePermission.roleId,
        permissionId: mockRolePermission.permissionId,
      });

      expect(rolePermission).toBeInstanceOf(RolePermissionEntity);
      expect(rolePermission.getRoleId()).toBe(mockRolePermission.roleId);
      expect(rolePermission.getPermissionId()).toBe(
        mockRolePermission.permissionId,
      );
    });

    it('should return undefined if role-permission not found', async () => {
      const rolePermission = await service.findOne({
        roleId: 'non-existent-role',
      });
      expect(rolePermission).toBeUndefined();
    });
  });

  describe('find', () => {
    it('should return all role-permissions', async () => {
      await service.create(mockRolePermission);
      await service.create({
        ...mockRolePermission,
        uuid: 'role-permission-uuid-456',
        permissionId: 'permission-uuid-456',
      });

      const rolePermissions = await service.find();
      expect(rolePermissions).toHaveLength(2);
    });

    it('should filter role-permissions by roleId', async () => {
      await service.create(mockRolePermission);
      await service.create({
        ...mockRolePermission,
        uuid: 'role-permission-uuid-456',
        roleId: 'role-uuid-456',
      });

      const rolePermissions = await service.find({
        roleId: mockRolePermission.roleId,
      });
      expect(rolePermissions).toHaveLength(1);
      expect(rolePermissions[0].getRoleId()).toBe(mockRolePermission.roleId);
    });

    it('should return empty array if no role-permissions match', async () => {
      const rolePermissions = await service.find({
        roleId: 'non-existent-role',
      });
      expect(rolePermissions).toEqual([]);
    });
  });

  describe('findByRoleId', () => {
    it('should find all permissions assigned to a role', async () => {
      await service.create(mockRolePermission);
      await service.create({
        ...mockRolePermission,
        uuid: 'role-permission-uuid-456',
        permissionId: 'permission-uuid-456',
      });
      await service.create({
        ...mockRolePermission,
        uuid: 'role-permission-uuid-789',
        roleId: 'role-uuid-789',
        permissionId: 'permission-uuid-789',
      });

      const rolePermissions = await repository.findByRoleId(
        mockRolePermission.roleId,
      );

      expect(rolePermissions).toHaveLength(2);
      expect(rolePermissions[0].getRoleId()).toBe(mockRolePermission.roleId);
      expect(rolePermissions[1].getRoleId()).toBe(mockRolePermission.roleId);
    });

    it('should return empty array if role has no permissions', async () => {
      const rolePermissions =
        await repository.findByRoleId('non-existent-role');
      expect(rolePermissions).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a role-permission successfully', async () => {
      await service.create(mockRolePermission);

      const updatedRolePermission = await service.update(
        { uuid: mockRolePermission.uuid },
        { permissionId: 'permission-uuid-updated' },
      );

      expect(updatedRolePermission.getPermissionId()).toBe(
        'permission-uuid-updated',
      );
    });

    it('should update role-permission by roleId', async () => {
      await service.create(mockRolePermission);

      const updatedRolePermission = await service.update(
        { roleId: mockRolePermission.roleId },
        { permissionId: 'permission-uuid-new' },
      );

      expect(updatedRolePermission.getPermissionId()).toBe(
        'permission-uuid-new',
      );
    });
  });

  describe('delete', () => {
    it('should delete a role-permission successfully', async () => {
      await service.create(mockRolePermission);

      const result = await service.delete({
        uuid: mockRolePermission.uuid,
      });

      expect(result).toBe(true);

      const rolePermission = await service.findById(mockRolePermission.uuid);
      expect(rolePermission).toBeUndefined();
    });

    it('should return false if role-permission not found', async () => {
      const result = await service.delete({ uuid: 'non-existent-uuid' });
      expect(result).toBe(false);
    });

    it('should delete a role-permission by roleId and permissionId', async () => {
      await service.create(mockRolePermission);

      const result = await service.delete({
        roleId: mockRolePermission.roleId,
        permissionId: mockRolePermission.permissionId,
      });

      expect(result).toBe(true);
    });
  });

  describe('count', () => {
    it('should count all role-permissions', async () => {
      await service.create(mockRolePermission);
      await service.create({
        ...mockRolePermission,
        uuid: 'role-permission-uuid-456',
      });

      const count = await service.count();
      expect(count).toBe(2);
    });

    it('should count role-permissions with filter', async () => {
      await service.create(mockRolePermission);
      await service.create({
        ...mockRolePermission,
        uuid: 'role-permission-uuid-456',
        roleId: 'role-uuid-456',
      });

      const count = await service.count({ roleId: mockRolePermission.roleId });
      expect(count).toBe(1);
    });

    it('should return 0 if no role-permissions match', async () => {
      const count = await service.count({ roleId: 'non-existent-role' });
      expect(count).toBe(0);
    });
  });

  describe('exists', () => {
    it('should return true if role-permission exists', async () => {
      await service.create(mockRolePermission);

      const exists = await service.exists({ uuid: mockRolePermission.uuid });
      expect(exists).toBe(true);
    });

    it('should return false if role-permission does not exist', async () => {
      const exists = await service.exists({ uuid: 'non-existent-uuid' });
      expect(exists).toBe(false);
    });

    it('should check if a specific role-permission combination exists', async () => {
      await service.create(mockRolePermission);

      const exists = await service.exists({
        roleId: mockRolePermission.roleId,
        permissionId: mockRolePermission.permissionId,
      });
      expect(exists).toBe(true);
    });
  });

  describe('createMany', () => {
    it('should create multiple role-permissions at once', async () => {
      const rolePermissions = await service.createMany([
        mockRolePermission,
        {
          ...mockRolePermission,
          uuid: 'role-permission-uuid-456',
          permissionId: 'permission-uuid-456',
        },
      ]);

      expect(rolePermissions).toHaveLength(2);
      expect(rolePermissions[0].getRoleId()).toBe(mockRolePermission.roleId);
      expect(rolePermissions[1].getPermissionId()).toBe('permission-uuid-456');
    });
  });

  describe('findManyByUuids', () => {
    it('should find multiple role-permissions by uuids', async () => {
      const rolePermission1 = await service.create(mockRolePermission);
      const rolePermission2 = await service.create({
        ...mockRolePermission,
        uuid: 'role-permission-uuid-456',
        permissionId: 'permission-uuid-456',
      });

      const rolePermissions = await service.findManyByUuids([
        rolePermission1.getUuid(),
        rolePermission2.getUuid(),
      ]);

      expect(rolePermissions).toHaveLength(2);
      const uuids = rolePermissions.map((rp) => rp.getUuid());
      expect(uuids).toContain(mockRolePermission.uuid);
      expect(uuids).toContain('role-permission-uuid-456');
    });

    it('should return empty array if no uuids match', async () => {
      const rolePermissions = await service.findManyByUuids([
        'non-existent-1',
        'non-existent-2',
      ]);
      expect(rolePermissions).toEqual([]);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple role-permissions', async () => {
      await service.createMany([
        mockRolePermission,
        {
          ...mockRolePermission,
          uuid: 'role-permission-uuid-456',
          permissionId: 'permission-uuid-456',
        },
      ]);

      const result = await service.deleteMany({});
      expect(result).toBe(true);

      const count = await service.count();
      expect(count).toBe(0);
    });

    it('should delete role-permissions matching filter', async () => {
      await service.create(mockRolePermission);
      await service.create({
        ...mockRolePermission,
        uuid: 'role-permission-uuid-456',
        roleId: 'role-uuid-456',
      });

      const result = await service.deleteMany({
        roleId: mockRolePermission.roleId,
      });
      expect(result).toBe(true);

      const count = await service.count();
      expect(count).toBe(1);
    });
  });

  describe('bulk operations', () => {
    it('should assign multiple permissions to a role', async () => {
      const permissions = [
        'permission-uuid-1',
        'permission-uuid-2',
        'permission-uuid-3',
      ];

      const rolePermissions = await service.createMany(
        permissions.map((permissionId, index) => ({
          uuid: `role-permission-uuid-${index}`,
          roleId: mockRolePermission.roleId,
          permissionId,
        })),
      );

      expect(rolePermissions).toHaveLength(3);

      const assignedPermissions = await repository.findByRoleId(
        mockRolePermission.roleId,
      );
      expect(assignedPermissions).toHaveLength(3);
    });

    it('should remove all permissions from a role', async () => {
      await service.createMany([
        mockRolePermission,
        {
          ...mockRolePermission,
          uuid: 'role-permission-uuid-456',
          permissionId: 'permission-uuid-456',
        },
      ]);

      const result = await service.deleteMany({
        roleId: mockRolePermission.roleId,
      });
      expect(result).toBe(true);

      const rolePermissions = await repository.findByRoleId(
        mockRolePermission.roleId,
      );
      expect(rolePermissions).toHaveLength(0);
    });

    it('should replace role permissions', async () => {
      // Create initial permissions
      await service.createMany([
        mockRolePermission,
        {
          ...mockRolePermission,
          uuid: 'role-permission-uuid-456',
          permissionId: 'permission-uuid-456',
        },
      ]);

      // Delete all existing permissions for the role
      await service.deleteMany({ roleId: mockRolePermission.roleId });

      // Create new permissions
      const newPermissions = await service.createMany([
        {
          uuid: 'role-permission-uuid-new-1',
          roleId: mockRolePermission.roleId,
          permissionId: 'permission-uuid-new-1',
        },
        {
          uuid: 'role-permission-uuid-new-2',
          roleId: mockRolePermission.roleId,
          permissionId: 'permission-uuid-new-2',
        },
      ]);

      expect(newPermissions).toHaveLength(2);

      const finalPermissions = await repository.findByRoleId(
        mockRolePermission.roleId,
      );
      expect(finalPermissions).toHaveLength(2);

      const permissionIds = finalPermissions.map((fp) => fp.getPermissionId());
      expect(permissionIds).toContain('permission-uuid-new-1');
      expect(permissionIds).toContain('permission-uuid-new-2');
    });
  });
});
