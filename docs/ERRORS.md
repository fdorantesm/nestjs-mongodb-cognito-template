# Error Codes Catalog

## Overview

This document catalogs all error codes used across the application. Each error has a unique code following the pattern `MODULE_RESOURCE_ERROR_TYPE_NUMBER` for better traceability and debugging.

## Error Code Pattern

```
[MODULE]_[RESOURCE]_[ERROR_TYPE]_[NUMBER]
```

- **MODULE**: Core module (CORE, AUTH, USERS, APPOINTMENTS, etc.)
- **RESOURCE**: Specific resource or entity
- **ERROR_TYPE**: Type of error (NOT_FOUND, INVALID, FAILED, etc.)
- **NUMBER**: Sequential 3-digit number

## Error Response Format

All errors return a consistent JSON structure:

```json
{
  "statusCode": 404,
  "code": "USERS_USER_NOT_FOUND_001",
  "message": "User not found",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "path": "/api/users/123e4567-e89b-12d3-a456-426614174000",
  "context": {
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

## Core Error Codes (15)

### Value Objects (CORE*VALUE*\*)

| Code                     | HTTP Status | Message       | Description                             |
| ------------------------ | ----------- | ------------- | --------------------------------------- |
| `CORE_VALUE_INVALID_001` | 400         | Invalid value | Generic value object validation failure |

### UUID (CORE*UUID*\*)

| Code                    | HTTP Status | Message             | Description                                |
| ----------------------- | ----------- | ------------------- | ------------------------------------------ |
| `CORE_UUID_INVALID_001` | 400         | Invalid UUID format | UUID string does not match expected format |

### Authentication (CORE*AUTH*\*)

| Code                         | HTTP Status | Message      | Description                             |
| ---------------------------- | ----------- | ------------ | --------------------------------------- |
| `CORE_AUTH_UNAUTHORIZED_001` | 401         | Unauthorized | User not authenticated or token invalid |
| `CORE_AUTH_FORBIDDEN_001`    | 403         | Forbidden    | User lacks required permissions         |

### Domain (CORE*DOMAIN*\*)

| Code                          | HTTP Status | Message            | Description                               |
| ----------------------------- | ----------- | ------------------ | ----------------------------------------- |
| `CORE_DOMAIN_NOT_FOUND_001`   | 404         | Resource not found | Requested resource does not exist         |
| `CORE_DOMAIN_CONFLICT_001`    | 409         | Resource conflict  | Resource already exists or state conflict |
| `CORE_DOMAIN_BAD_REQUEST_001` | 400         | Bad request        | Invalid request data or parameters        |

### Infrastructure (CORE*INFRA*\*)

| Code                              | HTTP Status | Message                | Description                     |
| --------------------------------- | ----------- | ---------------------- | ------------------------------- |
| `CORE_INFRA_INTERNAL_ERROR_001`   | 500         | Internal server error  | Unexpected server error         |
| `CORE_INFRA_DATABASE_001`         | 500         | Database error         | Database operation failed       |
| `CORE_INFRA_NETWORK_001`          | 503         | Network error          | Network communication failed    |
| `CORE_INFRA_EXTERNAL_SERVICE_001` | 502         | External service error | Third-party service unavailable |

## Authentication Module Error Codes (18)

### Credentials (AUTH*CREDENTIALS*\*)

| Code                           | HTTP Status | Message             | Description                          |
| ------------------------------ | ----------- | ------------------- | ------------------------------------ |
| `AUTH_CREDENTIALS_INVALID_001` | 401         | Invalid credentials | Email/password combination incorrect |
| `AUTH_CREDENTIALS_MISSING_002` | 400         | Missing credentials | Required credentials not provided    |

### User Status (AUTH*USER*\*)

| Code                               | HTTP Status | Message                 | Description                                  |
| ---------------------------------- | ----------- | ----------------------- | -------------------------------------------- |
| `AUTH_USER_ALREADY_REGISTERED_001` | 409         | User already registered | Email already exists in system               |
| `AUTH_USER_ALREADY_CONFIRMED_002`  | 409         | User already confirmed  | User account already confirmed               |
| `AUTH_USER_NOT_CONFIRMED_003`      | 401         | User not confirmed      | User must confirm email before login         |
| `AUTH_USER_NOT_FOUND_004`          | 404         | User not found          | User does not exist in authentication system |

### Tokens (AUTH*TOKEN*\*)

| Code                     | HTTP Status | Message       | Description                          |
| ------------------------ | ----------- | ------------- | ------------------------------------ |
| `AUTH_TOKEN_INVALID_001` | 401         | Invalid token | Token malformed or signature invalid |
| `AUTH_TOKEN_EXPIRED_002` | 401         | Token expired | Token has passed expiration time     |
| `AUTH_TOKEN_MISSING_003` | 401         | Missing token | Required token not provided          |

### Roles (AUTH*ROLE*\*)

| Code                           | HTTP Status | Message             | Description                        |
| ------------------------------ | ----------- | ------------------- | ---------------------------------- |
| `AUTH_ROLE_NOT_FOUND_001`      | 404         | Role not found      | Role does not exist                |
| `AUTH_ROLE_ALREADY_EXISTS_002` | 409         | Role already exists | Role with same name already exists |
| `AUTH_ROLE_INVALID_003`        | 400         | Invalid role        | Role data validation failed        |

### Permissions (AUTH*PERMISSION*\*)

| Code                                 | HTTP Status | Message                   | Description                        |
| ------------------------------------ | ----------- | ------------------------- | ---------------------------------- |
| `AUTH_PERMISSION_NOT_FOUND_001`      | 404         | Permission not found      | Permission does not exist          |
| `AUTH_PERMISSION_DENIED_002`         | 403         | Permission denied         | User lacks required permission     |
| `AUTH_PERMISSION_ALREADY_EXISTS_003` | 409         | Permission already exists | Permission code already registered |

### AWS Cognito (AUTH*COGNITO*\*)

| Code                                | HTTP Status | Message                        | Description                                |
| ----------------------------------- | ----------- | ------------------------------ | ------------------------------------------ |
| `AUTH_COGNITO_ERROR_001`            | 502         | Cognito service error          | AWS Cognito API call failed                |
| `AUTH_COGNITO_USER_EXISTS_002`      | 409         | User already exists in Cognito | Cognito user pool has existing user        |
| `AUTH_COGNITO_INVALID_PASSWORD_003` | 400         | Invalid password               | Password doesn't meet Cognito requirements |

## Users Module Error Codes (8)

### User Operations (USERS*USER*\*)

| Code                            | HTTP Status | Message              | Description                           |
| ------------------------------- | ----------- | -------------------- | ------------------------------------- |
| `USERS_USER_NOT_FOUND_001`      | 404         | User not found       | User with specified ID does not exist |
| `USERS_USER_ALREADY_EXISTS_001` | 409         | User already exists  | User with email already exists        |
| `USERS_USER_INVALID_DATA_002`   | 400         | Invalid user data    | User data validation failed           |
| `USERS_USER_UPDATE_FAILED_003`  | 500         | User update failed   | Failed to update user information     |
| `USERS_USER_DELETE_FAILED_004`  | 500         | User delete failed   | Failed to delete user                 |
| `USERS_USER_CREATE_FAILED_005`  | 500         | User creation failed | Failed to create new user             |
| `USERS_USER_INACTIVE_006`       | 403         | User inactive        | User account is inactive              |
| `USERS_USER_BLOCKED_007`        | 403         | User blocked         | User account is blocked               |

## Appointments Module Error Codes (17)

### Appointments (APPOINTMENTS*APPOINTMENT*\*)

| Code                                             | HTTP Status | Message                       | Description                                      |
| ------------------------------------------------ | ----------- | ----------------------------- | ------------------------------------------------ |
| `APPOINTMENTS_APPOINTMENT_NOT_FOUND_001`         | 404         | Appointment not found         | Appointment with specified ID does not exist     |
| `APPOINTMENTS_APPOINTMENT_NOT_PENDING_002`       | 400         | Appointment not pending       | Appointment is not in pending status             |
| `APPOINTMENTS_APPOINTMENT_ALREADY_CONFIRMED_003` | 409         | Appointment already confirmed | Appointment has already been confirmed           |
| `APPOINTMENTS_APPOINTMENT_CANNOT_CANCEL_004`     | 400         | Cannot cancel appointment     | Appointment cannot be cancelled in current state |
| `APPOINTMENTS_APPOINTMENT_INVALID_DATA_005`      | 400         | Invalid appointment data      | Appointment data validation failed               |

### Slots (APPOINTMENTS*SLOT*\*)

| Code                                   | HTTP Status | Message             | Description                                |
| -------------------------------------- | ----------- | ------------------- | ------------------------------------------ |
| `APPOINTMENTS_SLOT_NOT_FOUND_001`      | 404         | Slot not found      | Time slot with specified ID does not exist |
| `APPOINTMENTS_SLOT_NOT_AVAILABLE_002`  | 400         | Slot not available  | Time slot is already booked                |
| `APPOINTMENTS_SLOT_ALREADY_BOOKED_003` | 409         | Slot already booked | Time slot has an existing booking          |
| `APPOINTMENTS_SLOT_INVALID_TIME_004`   | 400         | Invalid slot time   | Time slot has invalid start/end times      |

### Schedules (APPOINTMENTS*SCHEDULE*\*)

| Code                                     | HTTP Status | Message               | Description                               |
| ---------------------------------------- | ----------- | --------------------- | ----------------------------------------- |
| `APPOINTMENTS_SCHEDULE_NOT_FOUND_001`    | 404         | Schedule not found    | Schedule with specified ID does not exist |
| `APPOINTMENTS_SCHEDULE_NOT_ACTIVE_002`   | 400         | Schedule not active   | Schedule is not currently active          |
| `APPOINTMENTS_SCHEDULE_INVALID_DATA_003` | 400         | Invalid schedule data | Schedule data validation failed           |
| `APPOINTMENTS_SCHEDULE_CONFLICT_004`     | 409         | Schedule conflict     | Schedule overlaps with existing schedule  |

### Booking (APPOINTMENTS*BOOKING*\*)

| Code                                 | HTTP Status | Message               | Description                          |
| ------------------------------------ | ----------- | --------------------- | ------------------------------------ |
| `APPOINTMENTS_BOOKING_FAILED_001`    | 500         | Booking failed        | Failed to create appointment booking |
| `APPOINTMENTS_BOOKING_PAST_DATE_002` | 400         | Cannot book past date | Appointment date is in the past      |

### Payments (APPOINTMENTS*PAYMENT*\*)

| Code                                | HTTP Status | Message          | Description                              |
| ----------------------------------- | ----------- | ---------------- | ---------------------------------------- |
| `APPOINTMENTS_PAYMENT_FAILED_001`   | 400         | Payment failed   | Payment processing failed                |
| `APPOINTMENTS_PAYMENT_REQUIRED_002` | 402         | Payment required | Payment is required for this appointment |

## Usage Examples

### TypeScript Usage

```typescript
import { UserNotFoundException } from '@/modules/users/domain/exceptions';

// Throw exception with context
throw new UserNotFoundException(userId);

// Response:
// {
//   "statusCode": 404,
//   "code": "USERS_USER_NOT_FOUND_001",
//   "message": "User not found",
//   "context": { "userId": "123e4567-e89b-12d3-a456-426614174000" }
// }
```

### Creating Custom Exceptions

```typescript
import { DomainException } from '@/core/domain/exceptions';
import { UserErrorCode } from '@/modules/users/domain/enums/user-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super({
      code: UserErrorCode.USER_NOT_FOUND,
      message: 'User not found',
      httpStatus: HttpStatus.NOT_FOUND,
      context: { userId },
    });
  }
}
```

### Catching and Handling Exceptions

```typescript
try {
  const user = await this.usersService.findByUuid(userId);
} catch (error) {
  if (error instanceof UserNotFoundException) {
    // Handle specific error
    console.log('Error code:', error.code); // USERS_USER_NOT_FOUND_001
  }
  throw error;
}
```

### HTTP Response Examples

#### 400 Bad Request

```json
{
  "statusCode": 400,
  "code": "APPOINTMENTS_SLOT_NOT_AVAILABLE_002",
  "message": "Slot not available",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "path": "/api/appointments/book",
  "context": {
    "slotId": "slot-123"
  }
}
```

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "code": "AUTH_TOKEN_EXPIRED_002",
  "message": "Token expired",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "path": "/api/auth/me"
}
```

#### 403 Forbidden

```json
{
  "statusCode": 403,
  "code": "AUTH_PERMISSION_DENIED_002",
  "message": "Permission denied",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "path": "/api/users",
  "context": {
    "requiredPermissions": ["users.create"],
    "userPermissions": ["users.read"]
  }
}
```

#### 404 Not Found

```json
{
  "statusCode": 404,
  "code": "APPOINTMENTS_APPOINTMENT_NOT_FOUND_001",
  "message": "Appointment not found",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "path": "/api/appointments/123",
  "context": {
    "appointmentId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

#### 409 Conflict

```json
{
  "statusCode": 409,
  "code": "AUTH_USER_ALREADY_REGISTERED_001",
  "message": "User already registered",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "path": "/api/auth/register",
  "context": {
    "email": "user@example.com"
  }
}
```

#### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "code": "CORE_INFRA_DATABASE_001",
  "message": "Database error",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "path": "/api/users"
}
```

## Best Practices

### DO ✅

- Use specific error codes for different failure scenarios
- Include relevant context in exceptions (IDs, user data, etc.)
- Import exceptions from domain layer: `@/modules/{module}/domain/exceptions`
- Use error codes for logging and monitoring
- Document new error codes in this file
- Create specific exception classes for business errors

### DON'T ❌

- Use generic exceptions (NotFoundException) without context
- Include sensitive data (passwords, tokens) in error context
- Throw exceptions from `@nestjs/common` in domain/application layers
- Create duplicate error codes
- Skip error code assignment
- Use magic strings for error messages

## Error Code Ranges

| Module       | Range   | Codes Used |
| ------------ | ------- | ---------- |
| Core         | 001-099 | 15         |
| Auth         | 001-099 | 18         |
| Users        | 001-099 | 8          |
| Appointments | 001-099 | 17         |
| **Total**    |         | **58**     |

## Migration Status

Total throw statements: **75+**

### Completed Modules ✅

- Core exceptions (2 files)
- Users module (5 files)
- Auth guards (2 files)
- Appointments commands (5 files)

### Pending Modules ⏳

- Auth controllers (1 file)
- Auth use cases (3 files)
- Auth commands (3 files)
- Identity services (2 files)
- Wallets module
- Settings module
- Stripe module

## Monitoring and Observability

Error codes can be used for:

1. **Logging**: Include error codes in structured logs
2. **Metrics**: Track error frequency by code
3. **Alerts**: Configure alerts for critical error codes
4. **Debugging**: Search logs by specific error code
5. **Analytics**: Analyze error patterns over time

Example structured log:

```json
{
  "level": "error",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "code": "USERS_USER_NOT_FOUND_001",
  "message": "User not found",
  "context": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "requestId": "req-abc123"
  },
  "stack": "..."
}
```

## See Also

- [Hexagonal Architecture](./HEXAGONAL_ARCHITECTURE_VIOLATIONS.md)
- [Audit Fields](./AUDIT_FIELDS.md)
- [Appointments Module](./APPOINTMENTS_MODULE.md)
- [Terminology](./TERMINOLOGY.md)
