import { Test, TestingModule } from '@nestjs/testing';

import { SettingsMemoryRepository } from '@/modules/settings/infrastructure/database/repositories/settings.memory-repository';
import { SETTINGS_REPOSITORY_TOKEN } from '@/modules/settings/domain/interfaces/settings.repository.interface';
import type { Setting } from '@/modules/settings/domain/interfaces';
import { SettingEntity } from '@/modules/settings/domain/entities';
import { SettingKey, SettingType } from '@/modules/settings/domain/enums';
import { SettingsService } from '@/modules/settings/infrastructure/services';

describe('SettingsService', () => {
  let service: SettingsService;
  let repository: SettingsMemoryRepository;

  const mockSetting: Setting = {
    uuid: 'setting-uuid-123',
    key: SettingKey.APP_NAME,
    value: 'My Application',
    type: SettingType.STRING,
    description: 'Application name',
    isPublic: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: SETTINGS_REPOSITORY_TOKEN,
          useClass: SettingsMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    repository = module.get<SettingsMemoryRepository>(
      SETTINGS_REPOSITORY_TOKEN,
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
    it('should create a setting successfully', async () => {
      const setting = await service.create(mockSetting);

      expect(setting).toBeInstanceOf(SettingEntity);
      expect(setting.getKey()).toBe(mockSetting.key);
      expect(setting.getValue()).toBe(mockSetting.value);
      expect(setting.getType()).toBe(mockSetting.type);
      expect(setting.getIsPublic()).toBe(true);
    });

    it('should create multiple settings', async () => {
      const setting1 = await service.create(mockSetting);
      const setting2 = await service.create({
        ...mockSetting,
        uuid: 'setting-uuid-456',
        key: SettingKey.PRIMARY_COLOR,
        value: '#FF5733',
        type: SettingType.COLOR,
        isPublic: false,
      });

      expect(setting1.getKey()).toBe(SettingKey.APP_NAME);
      expect(setting2.getKey()).toBe(SettingKey.PRIMARY_COLOR);
    });
  });

  describe('findById', () => {
    it('should find a setting by uuid', async () => {
      await service.create(mockSetting);
      const setting = await service.findById(mockSetting.uuid);

      expect(setting).toBeInstanceOf(SettingEntity);
      expect(setting.getUuid()).toBe(mockSetting.uuid);
      expect(setting.getKey()).toBe(mockSetting.key);
    });

    it('should return null if setting not found', async () => {
      const setting = await service.findById('non-existent-uuid');
      expect(setting).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should find a setting by key', async () => {
      await service.create(mockSetting);
      const setting = await service.findOne({ key: mockSetting.key });

      expect(setting).toBeInstanceOf(SettingEntity);
      expect(setting.getKey()).toBe(mockSetting.key);
    });

    it('should return null if setting not found', async () => {
      const setting = await service.findOne({ key: SettingKey.PRIMARY_COLOR });
      expect(setting).toBeUndefined();
    });
  });

  describe('find', () => {
    it('should return all settings', async () => {
      await service.create(mockSetting);
      await service.create({
        ...mockSetting,
        uuid: 'setting-uuid-456',
        key: SettingKey.PRIMARY_COLOR,
        value: '#FF5733',
        type: SettingType.COLOR,
      });

      const settings = await service.find();
      expect(settings).toHaveLength(2);
      expect(settings[0]).toBeInstanceOf(SettingEntity);
    });

    it('should filter settings by public status', async () => {
      await service.create(mockSetting);
      await service.create({
        ...mockSetting,
        uuid: 'setting-uuid-456',
        key: SettingKey.PRIMARY_COLOR,
        value: '#FF5733',
        type: SettingType.COLOR,
        isPublic: false,
      });

      const publicSettings = await service.find({ isPublic: true });
      expect(publicSettings).toHaveLength(1);
      expect(publicSettings[0].getKey()).toBe(SettingKey.APP_NAME);
    });
  });

  describe('update', () => {
    it('should update a setting successfully', async () => {
      await service.create(mockSetting);
      const updatedSetting = await service.update(
        { key: mockSetting.key },
        { value: 'Updated Application Name' },
      );

      expect(updatedSetting).toBeInstanceOf(SettingEntity);
      expect(updatedSetting.getValue()).toBe('Updated Application Name');
    });

    it('should change setting visibility', async () => {
      await service.create(mockSetting);
      const updatedSetting = await service.update(
        { key: mockSetting.key },
        { isPublic: false },
      );

      expect(updatedSetting.getIsPublic()).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a setting successfully', async () => {
      await service.create(mockSetting);
      const result = await service.delete({ uuid: mockSetting.uuid });

      expect(result).toBe(true);

      const setting = await service.findById(mockSetting.uuid);
      expect(setting).toBeUndefined();
    });
  });

  describe('count', () => {
    it('should count all settings', async () => {
      await service.create(mockSetting);
      await service.create({
        ...mockSetting,
        uuid: 'setting-uuid-456',
        key: SettingKey.PRIMARY_COLOR,
        value: '#FF5733',
        type: SettingType.COLOR,
      });

      const count = await service.count();
      expect(count).toBe(2);
    });

    it('should count public settings', async () => {
      await service.create(mockSetting);
      await service.create({
        ...mockSetting,
        uuid: 'setting-uuid-456',
        key: SettingKey.PRIMARY_COLOR,
        value: '#FF5733',
        type: SettingType.COLOR,
        isPublic: false,
      });

      const count = await service.count({ isPublic: true });
      expect(count).toBe(1);
    });
  });

  describe('exists', () => {
    it('should return true if setting exists', async () => {
      await service.create(mockSetting);
      const exists = await service.exists({ key: mockSetting.key });
      expect(exists).toBe(true);
    });

    it('should return false if setting does not exist', async () => {
      const exists = await service.exists({ key: SettingKey.PRIMARY_COLOR });
      expect(exists).toBe(false);
    });
  });
});
