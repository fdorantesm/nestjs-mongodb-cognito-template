# NestJS MongoDB Cognito Template

A production-ready NestJS template with MongoDB, AWS Cognito authentication, Hexagonal Architecture, and CQRS pattern. Perfect for building scalable APIs with clean architecture.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Adding Features](#adding-features)
- [Debugging](#debugging)
- [Key Concepts](#key-concepts)
- [Documentation](#documentation)

## Architecture Overview

This project follows **Hexagonal Architecture** (Ports & Adapters) with **CQRS** pattern:

```
domain/              # Pure business logic, entities, interfaces, commands/queries/events
application/         # Handlers orchestrate flow, use cases delegate to services
infrastructure/      # Adapters: http/controllers, database/repositories, services
```

**Critical Rule**: Application layer NEVER imports from infrastructure layer. Use `@InjectService('ServiceName')` or `@InjectRepository('RepositoryName')` with interface types from domain.

### Request Flow

```
Controller → UseCase → CommandBus/QueryBus → Handler → Service → Repository
```

Controllers pass `Context` object and delegate to use cases. Use cases dispatch commands/queries. Handlers orchestrate business logic via services.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.9
- **Database**: MongoDB with Mongoose
- **Authentication**: AWS Cognito with JWT
- **Architecture**: Hexagonal Architecture + CQRS
- **Testing**: Jest

## Project Structure

```
src/
├── modules/                 # Business modules
│   ├── {module}/
│   │   ├── domain/          # Entities, interfaces, commands, queries, events
│   │   ├── application/     # Handlers, use cases
│   │   └── infrastructure/  # Controllers, DTOs, repositories, services
│   ├── auth/                # Authentication & authorization
│   ├── identity/            # User identity management (Cognito)
│   ├── settings/            # System settings
│   └── users/               # User management
├── config/                  # Configuration management
├── core/                    # Shared utilities & base classes
└── database/                # Database connection & configuration

docs/                        # Detailed documentation
scripts/                     # Seed scripts & utilities
test/                        # E2E tests
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- Docker & Docker Compose
- AWS Cognito account

### Initial Setup

1. **Clone and install dependencies**:

   ```bash
   git clone <repository-url>
   cd nestjs-mongodb-cognito-template
   yarn install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

   > ⚠️ **Cognito settings are mandatory** – make sure `COGNITO_REGION` and `COGNITO_USER_POOL_ID` (at minimum) are set.
   > Missing values will cause startup errors like `Error: Region is missing`.

3. **Start MongoDB**:

   ```bash
   docker-compose up -d mongodb
   ```

4. **Seed database** (in order):

   ```bash
   yarn seed:roles          # Create roles (required first)
   yarn seed:users          # Create users
   yarn seed:settings       # Create default settings
   ```

   Or seed all at once:

   ```bash
   yarn seed:all
   ```

5. **Register users in AWS Cognito**:
   After seeding users, manually register them in AWS Cognito with password `OpenSesame!`

6. **Start development server**:
   ```bash
   yarn start:dev           # Runs on http://localhost:3000
   ```

## Development

### Available Commands

```bash
# Development
yarn start:dev              # Watch mode
yarn start:debug            # Debug mode
yarn build                  # Build for production
yarn start:prod             # Run production build

# Seeds (all have :unseed and :reset variants)
yarn seed:roles[:unseed|:reset]
yarn seed:users[:unseed|:reset]
yarn seed:settings
yarn seed:all[:undo|:reset]

# Code Quality
yarn lint                   # Run ESLint with autofix
yarn format                 # Run Prettier

# Testing
yarn test                   # Unit tests
yarn test:watch             # Watch mode
yarn test:cov               # With coverage
yarn test:e2e               # End-to-end tests
yarn test:debug             # Debug mode
```

## Testing

### Unit Tests

Located in `*.spec.ts` files alongside source code:

```bash
yarn test
yarn test:watch              # Continuous testing
yarn test:cov                # Generate coverage report
```

### E2E Tests

Located in `test/` directory:

```bash
yarn test:e2e
```

## Adding Features

### Step-by-Step Checklist

Follow this process to add a new feature (e.g., DELETE endpoint):

1. **Domain Layer** (`domain/`)

   - Create command/query class: `domain/commands/delete-{entity}.command.ts`
   - Add interface (optional): `domain/interfaces/{entity}-{service}.interface.ts`

2. **Application Layer** (`application/`)

   - Create handler: `application/commands/delete-{entity}.handler.ts`
   - Create use case: `application/use-cases/delete-{entity}.use-case.ts`
   - Register in barrel file: `application/commands/index.ts`, `application/use-cases/index.ts`

3. **Infrastructure Layer** (`infrastructure/`)

   - Add repository method (if needed): `database/repositories/{entity}.repository.ts`
   - Add service method (if needed): `services/{entity}.service.ts`
   - Add controller method: `http/controllers/{entity}.controller.ts`

4. **Module Registration** (`{module}.module.ts`)

   - Import handler in `CommandHandlers` array
   - Import use case in module `providers`
   - Inject use case in controller `constructor`

5. **Testing & Validation**
   - Compile: `yarn build`
   - Test: `yarn test`
   - Run dev server: `yarn start:dev`

### Example: Adding DELETE Setting

```bash
# 1. Domain: Create command
src/modules/settings/domain/commands/delete-setting.command.ts

# 2. Application: Create handler and use case
src/modules/settings/application/commands/delete-setting.handler.ts
src/modules/settings/application/use-cases/delete-setting.use-case.ts

# 3. Infrastructure: Add controller endpoint
src/modules/settings/infrastructure/http/controllers/settings.controller.ts

# 4. Module: Register handler and use case in settings.module.ts
# 5. Compile and test
yarn build && yarn start:dev
```

### Key Rules When Adding Features

1. **Never import infrastructure into application** - Use `@InjectService` or `@InjectRepository` with domain interface types
2. **Always use absolute imports** - `@/modules/...` instead of relative paths
3. **Always use entity `create()` method** - Never `new Entity()`
4. **One export per file** - Each class/interface/type in separate file
5. **File naming matches export** - `delete-setting.command.ts` exports `DeleteSettingCommand`
6. **Use ConfigService** - Never direct `process.env` access
7. **Repository prefix** - Implementation classes use `Database` prefix
8. **No `I` prefix on interfaces** - Use descriptive names
9. **Layer boundaries** - Domain → Application → Infrastructure (never reverse)
10. **Event handlers** - Multiple handlers can listen to same event (separate concerns)

## Debugging

### Finding Bugs

1. **Check logs**: Development mode provides detailed error logging
2. **Use debug mode**:

   ```bash
   yarn start:debug
   ```

   Then attach your debugger to `localhost:9229`

3. **Check for common issues**:
   - Layer boundary violations (app importing infrastructure)
   - Missing dependency injection tokens
   - Entity created without `create()` method
   - Relative imports instead of absolute
   - Missing `@Injectable()` decorator
   - Circular dependencies

### Debug Checklist

When tracking down a bug:

- [ ] Check error logs for stack trace
- [ ] Verify layer boundaries are respected
- [ ] Confirm all services/repositories are properly registered
- [ ] Check entity creation uses static `create()` method
- [ ] Verify all imports use absolute paths
- [ ] Test with isolated unit tests
- [ ] Check database indexes and queries
- [ ] Verify JWT token is valid (for auth issues)
- [ ] Check AWS Cognito configuration (for auth issues)

### Common Error Patterns

**"Cannot find module"**: Use absolute imports from `@/modules/...`

**"Cannot inject X"**: Check module providers array includes service/repository

**"Circular dependency"**: Refactor to use events or move shared logic to core

**Entity validation errors**: Check static `create()` method validation logic

## Key Concepts

### Authorization

Uses **permission-based authorization** (RBAC):

```typescript
@Get('/')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions(['Settings:Read'])
async getSettings() { ... }
```

Permissions follow pattern: `Resource:Action` (e.g., `Users:Create`, `Settings:Update`)

Define new permissions in `scripts/utils/roles.map.ts`

### Pagination

List endpoints support pagination, filtering, and sorting through query parameters:

```typescript
// Controller
@Get('/')
public async list(
  @Ctx() context: Context,
  @QueryParserDecorator() query?: QueryParser,
) {
  return this.listUseCase.execute(
    context,
    query?.filter,
    query?.options,
  );
}

// Use Case
public async execute(
  context: Context,
  filter?: Json,
  options?: QueryParsedOptions,
) {
  const items = await this.queryBus.execute(
    new ListQuery(filter, options),
  );
  return items.map(item => item.toJson());
}
```

**Query Parameters:**

- `filter[field]=value` - Filter by field
- `page=1` - Page number (default: 1)
- `limit=10` - Items per page (default: 10)
- `sort=field` - Sort by field ascending
- `sort=-field` - Sort by field descending

**Example:**

```bash
GET /v1/users?filter[role]=admin&page=1&limit=20&sort=-createdAt
```

**Import Required:**

```typescript
import { QueryParser as QueryParserDecorator } from '@/core/infrastructure/decorators/query-parser.decorator';
import type { QueryParser } from '@/core/types/general/query-parser.type';
import type { Json } from '@/core/domain/json';
import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
```

## Documentation

Detailed documentation in `docs/`:

- `HEXAGONAL_ARCHITECTURE_VIOLATIONS.md` - Common mistakes and solutions
- `AUDIT_FIELDS.md` - Tracking created/updated metadata
- `SETTINGS_MODULE.md` - System configuration management
- `ERRORS.md` - Error handling patterns
- `TESTING.md` - Testing best practices

## Configuration

All configuration via environment variables. See `.env.example` for required values.

Key configurations:

- **Database**: MongoDB connection string
- **Auth**: AWS Cognito credentials
- **Security**: JWT configuration

Access via `ConfigService`, never direct `process.env`.

## Commit Convention

Follow conventional commits in lowercase:

```
feat: add product creation endpoint
fix: resolve user validation issue
docs: update architecture documentation
refactor: extract validation logic
test: add user creation tests
chore: update dependencies
```

Present tense, max 50 chars for subject line.

## License

MIT
