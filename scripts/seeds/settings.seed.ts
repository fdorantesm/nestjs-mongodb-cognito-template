import { NestFactory } from '@nestjs/core';
import { CommandBus } from '@nestjs/cqrs';

import { MainModule } from '@/main.module';
import { InitializeSettingCommand } from '@/modules/settings/domain/commands';
import { SettingKey, SettingType } from '@/modules/settings/domain/enums';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MainModule);
  const commandBus = app.get(CommandBus);

  const defaultSettings = [
    // Branding
    {
      key: SettingKey.APP_NAME,
      value: 'Appo API',
      type: SettingType.STRING,
      description: 'Application name',
      isPublic: true,
    },
    {
      key: SettingKey.APP_DESCRIPTION,
      value: 'Appointment booking system',
      type: SettingType.STRING,
      description: 'Application description',
      isPublic: true,
    },
    {
      key: SettingKey.LOGO_URL,
      value: '',
      type: SettingType.URL,
      description: 'Logo URL',
      isPublic: true,
    },
    {
      key: SettingKey.FAVICON_URL,
      value: '',
      type: SettingType.URL,
      description: 'Favicon URL',
      isPublic: true,
    },

    // Colors
    {
      key: SettingKey.PRIMARY_COLOR,
      value: '#3B82F6',
      type: SettingType.COLOR,
      description: 'Primary brand color',
      isPublic: true,
    },
    {
      key: SettingKey.SECONDARY_COLOR,
      value: '#8B5CF6',
      type: SettingType.COLOR,
      description: 'Secondary brand color',
      isPublic: true,
    },
    {
      key: SettingKey.ACCENT_COLOR,
      value: '#10B981',
      type: SettingType.COLOR,
      description: 'Accent color for highlights',
      isPublic: true,
    },
    {
      key: SettingKey.SUCCESS_COLOR,
      value: '#22C55E',
      type: SettingType.COLOR,
      description: 'Success state color',
      isPublic: true,
    },
    {
      key: SettingKey.WARNING_COLOR,
      value: '#F59E0B',
      type: SettingType.COLOR,
      description: 'Warning state color',
      isPublic: true,
    },
    {
      key: SettingKey.ERROR_COLOR,
      value: '#EF4444',
      type: SettingType.COLOR,
      description: 'Error state color',
      isPublic: true,
    },
    {
      key: SettingKey.INFO_COLOR,
      value: '#3B82F6',
      type: SettingType.COLOR,
      description: 'Information state color',
      isPublic: true,
    },
    {
      key: SettingKey.BACKGROUND_COLOR,
      value: '#FFFFFF',
      type: SettingType.COLOR,
      description: 'Background color',
      isPublic: true,
    },
    {
      key: SettingKey.TEXT_COLOR,
      value: '#1F2937',
      type: SettingType.COLOR,
      description: 'Text color',
      isPublic: true,
    },

    // SEO
    {
      key: SettingKey.SEO_TITLE,
      value: 'Appo - Appointment Booking System',
      type: SettingType.STRING,
      description: 'SEO meta title',
      isPublic: true,
    },
    {
      key: SettingKey.SEO_DESCRIPTION,
      value:
        'Professional appointment booking system for businesses. Easy scheduling, payment processing, and customer management.',
      type: SettingType.STRING,
      description: 'SEO meta description',
      isPublic: true,
    },
    {
      key: SettingKey.SEO_KEYWORDS,
      value:
        'appointment booking, scheduling, calendar, reservation system, online booking',
      type: SettingType.STRING,
      description: 'SEO keywords (comma separated)',
      isPublic: true,
    },
    {
      key: SettingKey.SEO_IMAGE,
      value: '',
      type: SettingType.URL,
      description: 'SEO og:image URL',
      isPublic: true,
    },
    {
      key: SettingKey.SEO_AUTHOR,
      value: 'Appo Team',
      type: SettingType.STRING,
      description: 'SEO author meta tag',
      isPublic: true,
    },
    {
      key: SettingKey.SEO_ROBOTS,
      value: 'index, follow',
      type: SettingType.STRING,
      description: 'SEO robots meta tag',
      isPublic: true,
    },
    {
      key: SettingKey.SEO_CANONICAL_URL,
      value: '',
      type: SettingType.URL,
      description: 'SEO canonical URL',
      isPublic: true,
    },

    // Contact & Social
    {
      key: SettingKey.CONTACT_EMAIL,
      value: '',
      type: SettingType.STRING,
      description: 'Contact email address',
      isPublic: true,
    },
    {
      key: SettingKey.CONTACT_PHONE,
      value: '',
      type: SettingType.STRING,
      description: 'Contact phone number',
      isPublic: true,
    },
    {
      key: SettingKey.WEBSITE_URL,
      value: '',
      type: SettingType.URL,
      description: 'Website URL',
      isPublic: true,
    },
    {
      key: SettingKey.FACEBOOK_URL,
      value: '',
      type: SettingType.URL,
      description: 'Facebook page URL',
      isPublic: true,
    },
    {
      key: SettingKey.INSTAGRAM_URL,
      value: '',
      type: SettingType.URL,
      description: 'Instagram profile URL',
      isPublic: true,
    },
    {
      key: SettingKey.TWITTER_URL,
      value: '',
      type: SettingType.URL,
      description: 'Twitter profile URL',
      isPublic: true,
    },

    // Business
    {
      key: SettingKey.BUSINESS_ADDRESS,
      value: '',
      type: SettingType.STRING,
      description: 'Business physical address',
      isPublic: true,
    },
    {
      key: SettingKey.BUSINESS_HOURS,
      value: JSON.stringify({
        monday: '09:00-17:00',
        tuesday: '09:00-17:00',
        wednesday: '09:00-17:00',
        thursday: '09:00-17:00',
        friday: '09:00-17:00',
        saturday: 'Closed',
        sunday: 'Closed',
      }),
      type: SettingType.JSON,
      description: 'Business operating hours',
      isPublic: true,
    },
    {
      key: SettingKey.TIMEZONE,
      value: 'America/Mexico_City',
      type: SettingType.STRING,
      description: 'Business timezone',
      isPublic: true,
    },
  ];

  console.log('🚀 Initializing default settings...');

  for (const setting of defaultSettings) {
    try {
      const command = new InitializeSettingCommand(
        setting.key,
        setting.value,
        setting.type,
        setting.description,
        setting.isPublic,
      );

      await commandBus.execute(command);
      console.log(`✅ Initialized: ${setting.key}`);
    } catch (error) {
      console.error(`❌ Error initializing ${setting.key}:`, error.message);
    }
  }

  console.log('✨ Settings initialization completed!');
  await app.close();
}

bootstrap();
