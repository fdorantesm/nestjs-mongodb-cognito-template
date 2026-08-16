import { Test, TestingModule } from '@nestjs/testing';

import { ProfilesService } from './profiles.service';
import { ProfilesMemoryRepository } from '@/modules/users/infrastructure/database/repositories/profiles.memory-repository';
import { PROFILES_REPOSITORY_TOKEN } from '@/modules/users/domain/interfaces/profiles.service.interface';
import type { Profile } from '@/modules/users/domain/interfaces/profile.interface';
import { ProfileEntity } from '@/modules/users/domain/entities/profile.entity';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let repository: ProfilesMemoryRepository;

  const mockProfile: Profile = {
    uuid: 'profile-uuid-123',
    userId: 'user-uuid-123',
    displayName: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    location: 'New York',
    website: 'https://example.com',
    isPublic: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: PROFILES_REPOSITORY_TOKEN,
          useClass: ProfilesMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    repository = module.get<ProfilesMemoryRepository>(
      PROFILES_REPOSITORY_TOKEN,
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
    it('should create a profile successfully', async () => {
      const profile = await service.create(mockProfile);

      expect(profile).toBeInstanceOf(ProfileEntity);
      expect(profile.getUserId()).toBe(mockProfile.userId);
      expect(profile.getDisplayName()).toBe(mockProfile.displayName);
      expect(profile.toJson().bio).toBe(mockProfile.bio);
    });

    it('should create profiles for different users', async () => {
      const profile1 = await service.create(mockProfile);
      const profile2 = await service.create({
        ...mockProfile,
        uuid: 'profile-uuid-456',
        userId: 'user-uuid-456',
        displayName: 'Jane Doe',
      });

      expect(profile1.getDisplayName()).toBe('John Doe');
      expect(profile2.getDisplayName()).toBe('Jane Doe');
    });
  });

  describe('findById', () => {
    it('should find a profile by uuid', async () => {
      await service.create(mockProfile);
      const profile = await service.findById(mockProfile.uuid);

      expect(profile).toBeInstanceOf(ProfileEntity);
      expect(profile.getUuid()).toBe(mockProfile.uuid);
      expect(profile.getDisplayName()).toBe(mockProfile.displayName);
    });

    it('should return null if profile not found', async () => {
      const profile = await service.findById('non-existent-uuid');
      expect(profile).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should find a profile by userId', async () => {
      await service.create(mockProfile);
      const profile = await service.findOne({ userId: mockProfile.userId });

      expect(profile).toBeInstanceOf(ProfileEntity);
      expect(profile.getUserId()).toBe(mockProfile.userId);
    });

    it('should return null if profile not found', async () => {
      const profile = await service.findOne({ userId: 'non-existent-user' });
      expect(profile).toBeUndefined();
    });
  });

  describe('find', () => {
    it('should return all profiles', async () => {
      await service.create(mockProfile);
      await service.create({
        ...mockProfile,
        uuid: 'profile-uuid-456',
        userId: 'user-uuid-456',
        displayName: 'Jane Doe',
      });

      const profiles = await service.find();
      expect(profiles).toHaveLength(2);
      expect(profiles[0]).toBeInstanceOf(ProfileEntity);
    });

    it('should filter profiles by criteria', async () => {
      await service.create(mockProfile);
      await service.create({
        ...mockProfile,
        uuid: 'profile-uuid-456',
        userId: 'user-uuid-456',
        displayName: 'Jane Doe',
      });

      const profiles = await service.find({ displayName: 'Jane Doe' });
      expect(profiles).toHaveLength(1);
      expect(profiles[0].getDisplayName()).toBe('Jane Doe');
    });
  });

  describe('update', () => {
    it('should update a profile successfully', async () => {
      await service.create(mockProfile);
      const updatedProfile = await service.update(
        { uuid: mockProfile.uuid },
        { displayName: 'Updated Name', bio: 'Updated bio' },
      );

      expect(updatedProfile).toBeInstanceOf(ProfileEntity);
      expect(updatedProfile.getDisplayName()).toBe('Updated Name');
      expect(updatedProfile.toJson().bio).toBe('Updated bio');
    });

    it('should update profile by userId', async () => {
      await service.create(mockProfile);
      const updatedProfile = await service.update(
        { userId: mockProfile.userId },
        { avatarUrl: 'https://example.com/new-avatar.jpg' },
      );

      expect(updatedProfile.toJson().avatarUrl).toBe(
        'https://example.com/new-avatar.jpg',
      );
    });
  });

  describe('delete', () => {
    it('should delete a profile successfully', async () => {
      await service.create(mockProfile);
      const result = await service.delete({ uuid: mockProfile.uuid });

      expect(result).toBe(true);

      const profile = await service.findById(mockProfile.uuid);
      expect(profile).toBeUndefined();
    });
  });

  describe('count', () => {
    it('should count all profiles', async () => {
      await service.create(mockProfile);
      await service.create({
        ...mockProfile,
        uuid: 'profile-uuid-456',
        userId: 'user-uuid-456',
      });

      const count = await service.count();
      expect(count).toBe(2);
    });
  });

  describe('exists', () => {
    it('should return true if profile exists', async () => {
      await service.create(mockProfile);
      const exists = await service.exists({ userId: mockProfile.userId });
      expect(exists).toBe(true);
    });

    it('should return false if profile does not exist', async () => {
      const exists = await service.exists({ userId: 'non-existent-user' });
      expect(exists).toBe(false);
    });
  });
});
