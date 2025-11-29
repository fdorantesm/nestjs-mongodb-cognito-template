# Violaciones de Arquitectura Hexagonal y Soluciones

## Problema Identificado

Los handlers (application layer) están importando implementaciones de la capa de infraestructura, violando los principios de la arquitectura hexagonal.

### Ejemplos de Violaciones

```typescript
// ❌ MAL: Handler importando servicio de infraestructura
import { AppointmentsService } from '@/modules/appointments/infrastructure/services';

@CommandHandler(ConfirmAppointmentCommand)
export class ConfirmAppointmentCommandHandler {
  constructor(private readonly appointmentsService: AppointmentsService) {}
}
```

```typescript
// ❌ MAL: Handler importando repositorio directamente
import { AppointmentsRepository } from '@/modules/appointments/infrastructure/database/repositories';

@CommandHandler(ConfirmAppointmentCommand)
export class ConfirmAppointmentCommandHandler {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}
}
```

## ¿Por Qué Es Un Problema?

1. **Acoplamiento**: La capa de aplicación queda acoplada a implementaciones concretas de infraestructura
2. **Testabilidad**: Dificulta hacer testing unitario al depender de implementaciones concretas
3. **Mantenibilidad**: Cambios en infraestructura afectan directamente a la lógica de aplicación
4. **Principios SOLID**: Viola el Principio de Inversión de Dependencias (DIP)

## Regla Fundamental

**Los handlers siempre consumen servicios. Solo los servicios consumen repositorios.**

Esta regla garantiza:

- ✅ Separación clara de responsabilidades
- ✅ Los handlers solo orquestan flujos de negocio
- ✅ Los servicios encapsulan la lógica de acceso a datos
- ✅ Los repositorios son consumidos únicamente por servicios
- ✅ Facilita testing y mantenimiento

## Soluciones

### Solución Correcta: Usar Servicios con Interfaces del Dominio

Los handlers deben usar servicios a través de interfaces definidas en el dominio:

```typescript
// ✅ BIEN: Handler usando servicio con @InjectService e interfaz del dominio
import { InjectService } from '@/core/application/inject-service.decorator';
import type { AppointmentsService } from '@/modules/appointments/domain/interfaces/appointments.service.interface';

@CommandHandler(ConfirmAppointmentCommand)
export class ConfirmAppointmentCommandHandler {
  constructor(
    @InjectService('AppointmentsService')
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async execute(command: ConfirmAppointmentCommand): Promise<Appointment> {
    return this.appointmentsService.confirm(
      command.appointmentId,
      command.confirmedBy,
    );
  }
}
```

**Estructura de Archivos:**

```
modules/appointments/
  ├── domain/
  │   └── interfaces/
  │       └── appointments.service.interface.ts  # Interfaz del servicio
  ├── application/
  │   └── commands/
  │       └── confirm-appointment.handler.ts     # Usa @InjectService
  └── infrastructure/
      ├── services/
      │   └── appointments.service.ts           # Implementación
      └── database/
          └── repositories/
              └── appointments.repository.ts    # Usado solo por servicio
```

**Ventajas:**

- Servicios son parte del contrato del dominio (interfaces)
- No hay dependencia de la capa de infraestructura en handlers
- Mejor testabilidad con mocks de servicios
- Cumple con arquitectura hexagonal
- Los repositorios se mantienen aislados en la capa de servicios

### Patrón de Implementación

**1. Definir interfaz en el dominio:**

```typescript
// domain/interfaces/appointments.service.interface.ts
export interface AppointmentsService {
  confirm(appointmentId: string, confirmedBy: string): Promise<Appointment>;
  cancel(appointmentId: string, cancelledBy: string): Promise<Appointment>;
  findByUuid(uuid: string): Promise<Appointment | null>;
}
```

**2. Implementar servicio en infraestructura:**

```typescript
// infrastructure/services/appointments.service.ts
@Injectable()
export class AppointmentsService implements IAppointmentsService {
  constructor(
    @InjectRepository('AppointmentsRepository')
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async confirm(
    appointmentId: string,
    confirmedBy: string,
  ): Promise<Appointment> {
    const appointment =
      await this.appointmentsRepository.findByUuid(appointmentId);

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    // Lógica de negocio
    appointment.confirm(confirmedBy);

    // Actualizar
    const updated = await this.appointmentsRepository.update(
      { uuid: appointmentId },
      appointment.toJSON(),
    );

    return updated.toJson();
  }
}
```

**3. Usar en handler:**

```typescript
// application/commands/confirm-appointment.handler.ts
@CommandHandler(ConfirmAppointmentCommand)
export class ConfirmAppointmentCommandHandler {
  constructor(
    @InjectService('AppointmentsService')
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async execute(command: ConfirmAppointmentCommand): Promise<Appointment> {
    return this.appointmentsService.confirm(
      command.appointmentId,
      command.confirmedBy,
    );
  }
}
```

## Transformación de Entidades a JSON

**Regla fundamental: Los servicios siempre retornan JSON (plain objects), nunca entidades. Deben llamar `entity.toJson()` antes de retornar.**

```typescript
// ✅ CORRECTO: Servicio retorna JSON
@Injectable()
export class UsersService
  extends BaseService<User, UserEntity>
  implements IUsersService
{
  async findByUuid(uuid: string): Promise<User | null> {
    const entity = await this.usersRepository.findByUuid(uuid);
    return entity ? entity.toJson() : null; // Convertir a JSON
  }

  async findAll(): Promise<User[]> {
    const entities = await this.usersRepository.findAll();
    return entities.map((entity) => entity.toJson()); // Convertir array a JSON
  }
}

// ✅ CORRECTO: Use case recibe JSON del servicio
@UseCase()
export class GetUserUseCase implements Executable {
  async execute(context: Context, uuid: string): Promise<User | null> {
    return this.usersService.findByUuid(uuid); // Ya es JSON
  }
}

// ❌ INCORRECTO: Servicio retorna entidad
@Injectable()
export class UsersService {
  async findByUuid(uuid: string): Promise<UserEntity | null> {
    return this.usersRepository.findByUuid(uuid); // Retorna entidad
  }
}

// ❌ INCORRECTO: Use case intenta llamar toJson() sobre JSON
@UseCase()
export class GetUserUseCase {
  async execute(context: Context, uuid: string): Promise<User | null> {
    const user = await this.usersService.findByUuid(uuid);
    return user ? user.toJson() : null; // Error: user ya es JSON
  }
}
```

**¿Por qué esta separación?**

1. **Separación de responsabilidades**: Los servicios encapsulan la conversión de entidades a JSON
2. **Consistencia**: Toda la lógica de serialización está en una capa
3. **API limpia**: Los controllers reciben plain objects listos para serializar
4. **No exponer entidades fuera de infraestructura**: Las entidades son detalles de implementación
5. **Facilita testing**: Los use cases trabajan con objetos simples

**Flujo completo:**

```
Repository → Entity
Service → JSON (llama entity.toJson())
Handler → JSON (recibe de service)
Use Case → JSON (recibe de handler vía QueryBus/CommandBus)
Controller → JSON (recibe de use case)
```

## Creación de Entidades

**Regla fundamental: Las entidades siempre se crean usando el método estático `create()`, nunca con `new Entity()`.**

```typescript
// ✅ CORRECTO: Usar método estático create()
const user = UserEntity.create({
  uuid: uuidService.generate(),
  email: 'user@example.com',
  password: hashedPassword,
});

const appointment = AppointmentEntity.create(data);

// En repositorios:
const entity = UserExtraEntity.create(
  document.toObject({ getters: true, virtuals: true }),
);

// ❌ INCORRECTO: Usar constructor directamente
const user = new UserEntity({
  uuid: uuidService.generate(),
  email: 'user@example.com',
  password: hashedPassword,
});
```

**¿Por qué usar el método estático `create()`?**

1. **Validación centralizada**: El método `create()` puede ejecutar validaciones antes de crear la instancia
2. **Consistencia**: Garantiza que todas las entidades se creen de la misma forma
3. **Factory pattern**: Permite lógica de construcción compleja sin exponer el constructor
4. **Inmutabilidad controlada**: El constructor puede ser privado, forzando el uso de `create()`
5. **Mejor testing**: Facilita mocks y stubs al tener un punto de entrada único

### Solución para Casos Complejos: Puertos y Adaptadores

Para operaciones complejas que requieren múltiples repositorios, crear interfaces de puerto en el dominio:

```typescript
// domain/ports/appointments.port.ts
export interface AppointmentsPort {
  confirmAppointment(
    appointmentId: string,
    confirmedBy: string,
  ): Promise<AppointmentEntity>;
  cancelAppointment(
    appointmentId: string,
    cancelledBy: string,
  ): Promise<AppointmentEntity>;
}

// infrastructure/adapters/appointments.adapter.ts
@Injectable()
export class AppointmentsAdapter implements AppointmentsPort {
  constructor(
    @InjectRepository('AppointmentsRepository')
    private readonly appointmentsRepository: AppointmentsRepository,
    @InjectRepository('WalletsRepository')
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async confirmAppointment(
    appointmentId: string,
    confirmedBy: string,
  ): Promise<AppointmentEntity> {
    const appointment =
      await this.appointmentsRepository.findByUuid(appointmentId);
    appointment.confirm(confirmedBy);
    return this.appointmentsRepository.update(
      { uuid: appointmentId },
      appointment.toJSON(),
    );
  }
}

// application/commands/confirm-appointment.handler.ts
@CommandHandler(ConfirmAppointmentCommand)
export class ConfirmAppointmentCommandHandler {
  constructor(
    @Inject('AppointmentsPort')
    private readonly appointmentsPort: AppointmentsPort,
  ) {}

  async execute(
    command: ConfirmAppointmentCommand,
  ): Promise<AppointmentEntity> {
    return this.appointmentsPort.confirmAppointment(
      command.appointmentId,
      command.confirmedBy,
    );
  }
}
```

**Ventajas:**

- Desacoplamiento total de infraestructura
- Puertos definidos en dominio
- Adaptadores intercambiables
- Máxima flexibilidad

### Solución 3: Domain Services (Para Lógica de Dominio Compleja)

Cuando la lógica involucra múltiples entidades y no pertenece a ninguna en particular:

```typescript
// domain/services/appointment-confirmation.service.ts
export class AppointmentConfirmationService {
  public static confirm(
    appointment: AppointmentEntity,
    wallet: WalletEntity,
    confirmedBy: string,
  ): { appointment: AppointmentEntity; wallet: WalletEntity } {
    // Lógica de dominio pura
    appointment.confirm(confirmedBy);
    wallet.credit(appointment.getAmount(), 'APPOINTMENT_CONFIRMATION');

    return { appointment, wallet };
  }
}

// application/commands/confirm-appointment.handler.ts
@CommandHandler(ConfirmAppointmentCommand)
export class ConfirmAppointmentCommandHandler {
  constructor(
    @InjectRepository('AppointmentsRepository')
    private readonly appointmentsRepository: AppointmentsRepository,
    @InjectRepository('WalletsRepository')
    private readonly walletsRepository: WalletsRepository,
  ) {}

  async execute(
    command: ConfirmAppointmentCommand,
  ): Promise<AppointmentEntity> {
    const appointment = await this.appointmentsRepository.findByUuid(
      command.appointmentId,
    );
    const wallet = await this.walletsRepository.findByUserId(
      appointment.getUserId(),
    );

    // Usar domain service
    const { appointment: confirmedAppointment, wallet: updatedWallet } =
      AppointmentConfirmationService.confirm(
        appointment,
        wallet,
        command.confirmedBy,
      );

    // Persistir cambios
    await this.appointmentsRepository.update(
      { uuid: command.appointmentId },
      confirmedAppointment.toJSON(),
    );
    await this.walletsRepository.update(
      { uuid: wallet.getUuid() },
      updatedWallet.toJSON(),
    );

    return confirmedAppointment;
  }
}
```

## Reglas de ESLint

El proyecto tiene configurado `eslint-plugin-hexagonal-architecture` para detectar estas violaciones:

```javascript
// eslint.config.mjs
{
  files: [
    'src/modules/**/domain/**/*.ts',
    'src/modules/**/application/**/*.ts',
    'src/modules/**/infrastructure/**/*.ts',
  ],
  rules: {
    'hexagonal-architecture/enforce': ['error', {
      layers: [
        { name: 'domain', pattern: 'domain/**' },
        { name: 'application', pattern: 'application/**' },
        { name: 'infrastructure', pattern: 'infrastructure/**' },
      ],
      rules: [
        // Domain solo puede importar domain
        { from: 'domain', allow: ['domain'] },
        // Application puede importar domain y application
        { from: 'application', allow: ['domain', 'application'] },
        // Infrastructure puede importar todas las capas
        { from: 'infrastructure', allow: ['domain', 'application', 'infrastructure'] },
      ],
    }],
  },
}
```

## Checklist de Buenas Prácticas

- [ ] Los handlers nunca importan servicios de `infrastructure/services`
- [ ] Los handlers usan `@InjectRepository` para acceder a repositorios
- [ ] La lógica de negocio está en entidades del dominio
- [ ] Los servicios de infraestructura solo orquestan repositorios
- [ ] Los puertos se definen en el dominio, los adaptadores en infraestructura
- [ ] Los domain services contienen lógica de dominio pura (sin I/O)
- [ ] ESLint no reporta violaciones de `hexagonal-architecture/enforce`

## Resumen

| Capa               | Puede Importar                      | NO Puede Importar           |
| ------------------ | ----------------------------------- | --------------------------- |
| **Domain**         | domain                              | application, infrastructure |
| **Application**    | domain, application                 | infrastructure              |
| **Infrastructure** | domain, application, infrastructure | (puede todo)                |

**Regla de Oro**: La dependencia siempre fluye hacia adentro (hacia el dominio), nunca hacia afuera.
