# Settings Module - Documentation

## Overview

The Settings module provides a flexible key-value configuration system stored in MongoDB. It allows customization of branding, contact information, and business details without code changes.

## Key Features

### 1. **Key-Value Storage**

- Generic configuration system
- Typed values (string, number, boolean, JSON, URL, color)
- Description field for documentation
- Public/private visibility control

### 2. **Multi-Category Settings**

#### 🎨 Branding

- `logo_url`: Logo image URL
- `favicon_url`: Favicon URL
- `app_name`: Application name
- `app_description`: Application description
- `primary_color`: Primary brand color (hex)
- `secondary_color`: Secondary brand color (hex)

#### 📞 Contact & Social

- `contact_email`: Contact email address
- `contact_phone`: Contact phone number
- `website_url`: Website URL
- `facebook_url`: Facebook page URL
- `instagram_url`: Instagram profile URL
- `twitter_url`: Twitter profile URL

#### 🏢 Business Information

- `business_address`: Physical business address
- `business_hours`: Operating hours (JSON format)
- `timezone`: Business timezone

### 3. **Public/Private Settings**

- **Public Settings**: Accessible without authentication (branding, contact, hours)
- **Private Settings**: Require authentication (internal config)

## Architecture

### Domain Layer

```
domain/
├── entities/
│   └── setting.entity.ts          # SettingEntity with helper methods
├── interfaces/
│   └── setting.interface.ts       # Setting, SettingProps
├── enums/
│   ├── setting-key.enum.ts        # All available setting keys
│   └── setting-type.enum.ts       # STRING, NUMBER, BOOLEAN, JSON, URL, COLOR
├── commands/
│   ├── initialize-setting/        # InitializeSettingCommand
│   └── update-setting/            # UpdateSettingCommand
└── queries/
    ├── get-setting/               # GetSettingQuery
    ├── get-public-settings/       # GetPublicSettingsQuery
    └── get-all-settings/          # GetAllSettingsQuery
```

### Application Layer

```
application/
├── commands/
│   ├── initialize-setting.handler.ts  # Creates setting if not exists
│   └── update-setting.handler.ts      # Updates existing setting
├── queries/
│   ├── get-setting.handler.ts         # Get single setting by key
│   ├── get-public-settings.handler.ts # Get all public settings
│   └── get-all-settings.handler.ts    # Get all settings (authenticated)
└── constants.ts                        # Injection tokens
```

### Infrastructure Layer

```
infrastructure/
├── database/
│   ├── models/
│   │   └── setting.model.ts       # MongoDB schema
│   └── repositories/
│       └── settings.repository.ts # Data access
├── services/
│   └── settings.service.ts        # Business logic
├── controllers/
│   └── settings.controller.ts     # REST endpoints
└── dtos/
    └── setting.dto.ts             # UpdateSettingDto, InitializeSettingDto
```

## API Endpoints

### 1. Get Public Settings

Get all settings marked as public (no authentication required).

**Endpoint**: `GET /settings/public`

**Response**:

```json
[
  {
    "uuid": "setting-uuid-1",
    "key": "app_name",
    "value": "My API",
    "type": "string",
    "description": "Application name",
    "isPublic": true
  },
  {
    "uuid": "setting-uuid-2",
    "key": "primary_color",
    "value": "#3B82F6",
    "type": "color",
    "description": "Primary brand color",
    "isPublic": true
  }
]
```

### 2. Get All Settings

Get all settings (requires authentication).

**Endpoint**: `GET /settings`

**Headers**: `Authorization: Bearer <token>`

### 3. Get Single Setting

Get a specific setting by key (requires authentication).

**Endpoint**: `GET /settings/:key`

**Example**: `GET /settings/app_name`

### 4. Update Setting

Update an existing setting value (requires authentication).

**Endpoint**: `PATCH /settings`

**Body**:

```json
{
  "key": "primary_color",
  "value": "#FF5733"
}
```

## Database Schema

### Setting Model

```typescript
{
  uuid: string (unique)
  key: SettingKey (unique, indexed)
  value: string // Always stored as string, parsed based on type
  type: SettingType (string, number, boolean, json, url, color)
  description?: string
  isPublic: boolean (indexed)
  updatedBy?: string // Who last updated the setting
  createdAt: Date
  updatedAt: Date
}
```

**Indexes**:

- `key` (unique)
- `isPublic` (for filtering public settings)
- `uuid` (unique)

## Setting Types

### SettingType Enum

```typescript
enum SettingType {
  STRING = 'string', // Plain text
  NUMBER = 'number', // Numeric values
  BOOLEAN = 'boolean', // true/false (stored as "true"/"false" string)
  JSON = 'json', // Complex objects (stored as JSON string)
  URL = 'url', // URLs
  COLOR = 'color', // Hex colors (#RRGGBB)
}
```

### Helper Methods

The `SettingEntity` provides helper methods to parse values:

```typescript
// String value (raw)
setting.getValueAsString(): string

// Number value
setting.getValueAsNumber(): number

// Boolean value
setting.getValueAsBoolean(): boolean

// JSON object
setting.getValueAsJson<T>(): T
```

## Initialization Script

### Setup Default Settings

Run the seed script to initialize all default settings:

```bash
yarn seed:settings
```

This script:

- Creates all default settings if they don't exist
- Uses `InitializeSettingCommand` to avoid duplicates
- Logs success/failure for each setting

## Usage Examples

### 1. Configure Branding

```typescript
// Update app name
await commandBus.execute(
  new UpdateSettingCommand(SettingKey.APP_NAME, 'My Application'),
);

// Update primary color
await commandBus.execute(
  new UpdateSettingCommand(SettingKey.PRIMARY_COLOR, '#10B981'),
);
```

### 2. Fetch Public Settings (Frontend)

```typescript
// No authentication needed for public settings
const response = await fetch('https://api.example.com/settings/public');
const settings = await response.json();

// Parse settings into an object
const config = settings.reduce((acc, setting) => {
  acc[setting.key] = setting.value;
  return acc;
}, {});

// Use in frontend
document.title = config.app_name;
document.body.style.setProperty('--primary-color', config.primary_color);
```

## CQRS Pattern

### Commands

1. **InitializeSettingCommand**: Creates setting if doesn't exist (idempotent)
2. **UpdateSettingCommand**: Updates existing setting value

### Queries

1. **GetSettingQuery**: Fetch single setting by key
2. **GetPublicSettingsQuery**: Fetch all public settings
3. **GetAllSettingsQuery**: Fetch all settings (requires auth)

## Adding New Settings

### 1. Add to SettingKey Enum

```typescript
// src/modules/settings/domain/enums/setting-key.enum.ts
export enum SettingKey {
  // ... existing keys
  MY_NEW_SETTING = 'my_new_setting',
}
```

### 2. Add to Seed Script

```typescript
// scripts/seeds/settings.seed.ts
{
  key: SettingKey.MY_NEW_SETTING,
  value: 'default_value',
  type: SettingType.STRING,
  description: 'Description of my new setting',
  isPublic: true,
}
```

### 3. Run Seed Script

```bash
yarn seed:settings
```

## Best Practices

### ✅ DO

- Use public settings for frontend-visible config (branding, contact)
- Use private settings for business rules and internal config
- Parse values using entity helper methods (`getValueAsNumber()`, etc.)
- Initialize default settings using the seed script
- Use `InitializeSettingCommand` to avoid duplicates

### ❌ DON'T

- Don't store sensitive data in public settings
- Don't store complex objects as JSON unless necessary
- Don't bypass the entity helpers for type conversion
- Don't update settings directly in the database

## Notes

- All values stored as strings in DB, parsed by type
- Settings are unique by `key` (prevents duplicates)
- Public settings accessible without authentication
- `updatedBy` tracks who made the last change
- Business hours stored as JSON for flexibility
- Timezone support for multi-region businesses
