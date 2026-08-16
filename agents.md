# Code Agent instructions

## Codebase

- Analize and understand the codebase structure and conventions and make your own summary and extend these guidelines.
- The codebase is organized into modules, each encapsulating a specific domain of the application.
- The project follows Hexagonal Architecture principles.
- The backend is built using NestJS and TypeScript.
- The database is MongoDB, accessed via Mongoose.
- The project uses CQRS pattern with commands and queries for business logic.
- The codebase is modular, with each module encapsulating its own domain logic, application services, and infrastructure.

## Style Guide

- Use clear and concise language.
- Use proper formatting for code snippets.
- Ensure technical accuracy.
- All completions and suggestions must align with the latest codebase and project structure and conventions and follow English.
- Avoid emojis in code comments and commit messages.
- Use present tense for commit messages in lowercase and prefix with the commit type (e.g., feat:, fix:, docs:, refactor:, test:, chore:).
- Avoid using passive voice in commit messages.
- Limit commit messages to 50 characters for the subject line and 72 characters for the body.
- Nothing by default, explicit is better than implicit.

## Typescript

- Use modern TypeScript features and best practices.
- Ensure type safety and proper typings.
- Follow project-specific coding conventions and style guides.
- All public methods and properties must have explicit type annotations and public access modifiers.
- Avoid `get` and `set` accessors unless absolutely necessary; prefer explicit methods for clarity (e.g., `getUserId()` instead of `get userId()`).
- Imports must use absolute paths starting from the `src` and aliases directory, avoiding relative paths.
- Each interface, type, enum or class must be in its own file and their filenames must match their exported name in kebab-case like `movement-type.enum.ts`.
- Sort imports alphabetically within their groups (external libraries, internal modules, etc.). First native modules, then third-party modules, then internal modules.
- Entities must be in the `domain/entities` folder of each module.
- Entities must be created using the static `create` method instead of direct constructor calls.

## NestJS

- Follow NestJS architectural patterns and best practices.
- Use decorators appropriately for dependency injection, controllers, services, etc.
- Ensure proper module organization and separation of concerns.
- Use NestJS built-in features for error handling, logging, and configuration management.
- Leverage NestJS CQRS module for command and event handling where applicable.
- Avoid direct service exports from modules; prefer using CQRS commands and queries for inter-module communication.
- Always use config service for accessing environment variables and configuration settings instead of direct access to `process.env`.
- Avoid using `any` type; prefer specific types or generics for better type safety.
- DTOs just for http layer must be in a dedicated `dto` folder inside the controller folder.
- Request must be pass context via `context` parameter instead of using global variables to the use cases.
- Controller->UseCase->CommandBus/QueryBus->Handler->Service->Repository is the preferred flow for handling requests.
- **Handlers always consume services. Only services consume repositories.**
- Handlers must use `@InjectService` decorator to inject services via their domain interfaces.
- Services must use `@InjectRepository` decorator to inject repositories.
- Never inject repositories directly into handlers; always go through services.
- infrastructure/http/{controllers,dtos} must only handle request/response and delegate all business logic to use cases.
- Use cases just orchestrate the flow and delegate to services for business logic and return results to controllers.
- **Services always return JSON (plain objects), not entities. Services must call `entity.toJson()` before returning.**
- Use cases receive JSON from services and return JSON to controllers.
- Handlers may return entities or JSON depending on the flow, but services must always convert entities to JSON.

### Pagination Pattern

- All list endpoints must support pagination using `@QueryParserDecorator()`.
- Controller receives `QueryParser` type with `filter` and `options` properties.
- Use case receives `filter?: Json` and `options?: QueryParsedOptions` parameters.
- Query handlers receive filter and options to build MongoDB queries.
- Example controller pattern:
  ```typescript
  @Get('/')
  public async list(
    @Ctx() context: Context,
    @QueryParserDecorator() query?: QueryParser,
  ) {
    return this.listUseCase.execute(context, query?.filter, query?.options);
  }
  ```
- Example use case pattern:
  ```typescript
  public async execute(
    context: Context,
    filter?: Json,
    options?: QueryParsedOptions,
  ) {
    const items = await this.queryBus.execute(new ListQuery(filter, options));
    return items.map(item => item.toJson());
  }
  ```
- Required imports:
  - `import { QueryParser as QueryParserDecorator } from '@/core/infrastructure/decorators/query-parser.decorator';`
  - `import type { QueryParser } from '@/core/types/general/query-parser.type';`
  - `import type { Json } from '@/core/domain/json';`
  - `import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';`

## Database Design

- Use generic terms like `userId` for database fields.
- Index fields appropriately for query efficiency.
- Follow best practices for naming consistency across modules.
- Ensure scalability by allowing new features to be added without schema changes.

## Hexagonal Architecture

- Maintain clear boundaries between domain, application, and infrastructure layers.
- Use ports and adapters to facilitate communication between layers.
- Ensure domain logic is isolated from external dependencies.
- Follow best practices for dependency injection and inversion of control.
- Implementation must use prefixes like `DatabaseUsersRepository` for database repositories to indicate their role as adapters.
- Interfaces don't need the `I` prefix; use descriptive names like `UsersRepository` instead.
- Avoid circular dependencies between layers.
- **Entities must be created using the static `create()` method, never with `new Entity()`.**
- Command, Event and Query classes must be in the `domain/commands`, `domain/events` and `domain/queries` folders respectively.
- CommandHandler, EventHandler and QueryHandler classes must be in the `application/commands`, `application/events` and `application/queries` folders respectively.
- Handlers must be registered in a barrel file in the `application/command`, `application/events` and `application/queries` folders respectively.
- **Handlers always consume services via domain interfaces. Only services consume repositories.**
- Handlers must use `@InjectService('ServiceName')` to inject services and import types from `domain/interfaces`.
- Services must be in the `infrastructure/services` folder of each module and must be agnostic to the transport layer receiving repository or client interfaces instead implementations of infrastructure layer.
- Services must extend `BaseService<Interface, Entity>` and inject repositories using `@InjectRepository` decorator instead of extending repositories directly.
- Services must receive repositories via constructor injection using `@InjectRepository('RepositoryName')` and pass them to `super()`.
- All service methods must be defined in their corresponding interface in `domain/interfaces`.
- Example service pattern:

  ```typescript
  @Injectable()
  export class UsersService
    extends BaseService<User, UserEntity>
    implements IUsersService
  {
    constructor(
      @InjectRepository('UsersRepository')
      private readonly usersRepository: UsersRepository,
    ) {
      super(usersRepository);
    }

    // Services always return JSON, not entities
    async findByUuid(uuid: string): Promise<User | null> {
      const entity = await this.usersRepository.findByUuid(uuid);
      return entity ? entity.toJson() : null;
    }

    async findAll(): Promise<User[]> {
      const entities = await this.usersRepository.findAll();
      return entities.map((entity) => entity.toJson());
    }
  }
  ```

- Example handler pattern:
  ```typescript
  @CommandHandler(CreateUserCommand)
  export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
      @InjectService('UsersService')
      private readonly usersService: UsersService, // Type from domain/interfaces
    ) {}
  }
  ```
- Example entity creation in repositories:

  ```typescript
  // ✅ CORRECT: Using static create method
  const entity = UserEntity.create(
    document.toObject({ getters: true, virtuals: true }),
  );

  // ❌ WRONG: Using new keyword
  const entity = new UserEntity(
    document.toObject({ getters: true, virtuals: true }),
  );
  ```

## Documentation

- Provide clear and comprehensive documentation for modules, services, and key components.
- Use markdown files for terminology and best practices.
- Ensure documentation is up-to-date with the latest codebase changes.
- Include examples and use cases where applicable.
- Follow a consistent structure for documentation files.
- Try to avoid redundancy between documentation files; consolidate information where possible.
- Use tables and lists for clarity in explanations.
- Highlight best practices with clear DOs and DON'Ts sections.
- Summarize key points at the end of documentation sections.
- Ensure terminology is consistent across all documentation.
- Use headings and subheadings effectively to organize content.
- Use bold text to emphasize important terms and concepts.
- Create files in the docs/ directory for terminology and best practices.

## Summary

- Ensure all code and documentation adhere to the specified guidelines.
- Maintain high standards of quality, clarity, and consistency throughout the project.
- Regularly review and update guidelines to reflect best practices and project evolution.
- Promote collaboration and knowledge sharing among team members through clear documentation and coding standards.
- Strive for excellence in both code quality and documentation to facilitate maintainability and scalability of the project.
