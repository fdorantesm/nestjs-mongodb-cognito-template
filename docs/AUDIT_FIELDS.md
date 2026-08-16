# Audit and Traceability Fields

## Overview

This document describes the audit and traceability field structure implemented in the appointment system.

## Audit Fields

All main entities in the system include audit fields to track who created and modified each record:

- **createdBy**: UUID of the user who created the record (required)
- **updatedBy**: UUID of the user who last modified the record (optional)
- **createdAt**: Creation timestamp (automatic by Mongoose)
- **updatedAt**: Last update timestamp (automatic by Mongoose)

## Business Fields vs Audit Fields

It's important to distinguish between audit fields and business fields related to users:

### Schedules

| Field | Type | Purpose | Description |
|-------|------|---------|-------------|
| `userId` | string | Business | Provider who owns the schedule (doctor, vet, etc.) |
| `createdBy` | string | Audit | User who created the schedule (could be an assistant) |
| `updatedBy` | string? | Audit | User who last modified the schedule |

**Use case example:**
- An assistant (`createdBy`) creates a schedule for a doctor (`userId`)
- Later, another assistant (`updatedBy`) modifies that schedule

### AvailableSlots

| Field | Type | Purpose | Description |
|-------|------|---------|-------------|
| `userId` | string | Business | Provider who will attend this slot |
| `createdBy` | string | Audit | User who generated the slot |
| `updatedBy` | string? | Audit | User who modified the slot |

**Use case example:**
- The system automatically generates slots based on a schedule
- Slots are created with `createdBy` of the user who executed the action
- If someone cancels or modifies a slot, it's recorded in `updatedBy`

### Appointments

| Field | Type | Purpose | Description |
|-------|------|---------|-------------|
| `userId` | string | Business | Provider who will attend the appointment |
| `customerId` | string | Business | Client/patient who receives the service |
| `createdBy` | string | Audit | User who created the initial appointment |
| `updatedBy` | string? | Audit | User who modified the appointment |
| `confirmedBy` | string? | Business/Audit | User who confirmed the appointment |

**Use case example:**
- A client books an appointment online (`createdBy` = customerId)
- The appointment is created in PENDING status without assigned `userId`
- An assistant confirms the appointment and assigns the doctor (`confirmedBy`, `updatedBy`, `userId`)
- If cancelled, who made the cancellation is recorded in `updatedBy`

## Appointment Workflow

### 1. Schedule Creation
```typescript
{
  userId: "uuid-doctor-1",         // The doctor who will attend
  createdBy: "uuid-assistant-1",   // The assistant who configured the schedule
  name: "Dr. Garcia Schedule",
  daysOfWeek: [1, 2, 3, 4, 5],
  timeBlocks: [...]
}
```

### 2. Slot Generation
```typescript
{
  userId: "uuid-doctor-1",         // The doctor who will attend
  createdBy: "uuid-assistant-1",   // Who generated the slots
  scheduleId: "uuid-schedule",
  date: "2025-12-01",
  startTime: "10:00",
  endTime: "11:00"
}
```

### 3. Appointment Booking by Client
```typescript
{
  customerId: "uuid-client-1",     // The patient
  userId: null,                     // Not assigned yet
  createdBy: "uuid-client-1",      // Client booked their own appointment
  slotId: "uuid-slot",
  status: "PENDING",
  amount: 500
}
```

### 4. Confirmation by Assistant
```typescript
{
  customerId: "uuid-client-1",     // The patient
  userId: "uuid-doctor-1",         // Assigned to doctor
  createdBy: "uuid-client-1",      // Created by client
  updatedBy: "uuid-assistant-1",   // Modified by assistant
  confirmedBy: "uuid-assistant-1", // Confirmed by assistant
  confirmedAt: "2025-11-20T10:00:00Z",
  slotId: "uuid-slot",
  status: "CONFIRMED",
  amount: 500
}
```

## Typical User Roles

The system supports multiple types of users:

1. **Providers** (`userId` in schedules/slots/appointments)
   - Doctors, veterinarians, stylists, etc.
   - Those who provide the service

2. **Clients** (`customerId` in appointments)
   - Patients, pet owners, customers, etc.
   - Those who receive the service

3. **Assistants/Administrators** (may appear in `createdBy`, `updatedBy`, `confirmedBy`)
   - Manage schedules and appointments
   - Confirm and assign providers to appointments
   - Don't necessarily provide services directly

## Best Practices

### ✅ DOs

- **Always set `createdBy`** when creating any record
- **Update `updatedBy`** on each modification
- **Separate roles**: Don't confuse audit with business logic
- **Use `userId` for assignment**: In appointments, `userId` is assigned on confirmation
- **Validate permissions**: Verify that the user has permissions for the action

### ❌ DON'Ts

- **Don't use `createdBy` as `userId`**: They are different concepts
- **Don't assume single user**: The system supports multiple providers
- **Don't omit audit fields**: They are essential for traceability
- **Don't assign `userId` prematurely**: In appointments, wait for confirmation

## Multi-User Example

Scenario: Clinic with 2 doctors and 1 assistant

**Users:**
- Dr. Garcia (provider)
- Dr. Martinez (provider)
- Ana (assistant)
- Juan (patient)

**Flow:**
1. Ana creates schedules for both doctors
   - Schedule 1: `userId=Dr.Garcia`, `createdBy=Ana`
   - Schedule 2: `userId=Dr.Martinez`, `createdBy=Ana`

2. System generates slots for next 60 days
   - Dr. Garcia slots: `userId=Dr.Garcia`, `createdBy=Ana`
   - Dr. Martinez slots: `userId=Dr.Martinez`, `createdBy=Ana`

3. Juan books appointment online
   - Appointment: `customerId=Juan`, `userId=null`, `createdBy=Juan`, `status=PENDING`

4. Ana confirms and assigns to Dr. Martinez
   - Appointment: `customerId=Juan`, `userId=Dr.Martinez`, `updatedBy=Ana`, `confirmedBy=Ana`, `status=CONFIRMED`

## Field Summary by Entity

| Entity | userId | customerId | createdBy | updatedBy | confirmedBy |
|---------|--------|------------|-----------|-----------|-------------|
| **Schedule** | ✅ Provider | ❌ | ✅ Audit | ✅ Audit | ❌ |
| **AvailableSlot** | ✅ Provider | ❌ | ✅ Audit | ✅ Audit | ❌ |
| **Appointment** | ✅ Provider | ✅ Client | ✅ Audit | ✅ Audit | ✅ Confirms |

## Recommended Validations

### When Creating Schedule
```typescript
// Validate that userId is a valid provider
// Validate that createdBy has permissions to create schedules
```

### When Generating Slots
```typescript
// createdBy must be who executes the action
// userId is inherited from schedule
```

### When Creating Appointment
```typescript
// customerId must be a valid client
// createdBy = current user (client or assistant)
// userId can be null initially
// status = PENDING if no userId assigned
```

### When Confirming Appointment
```typescript
// userId must be assigned (valid provider)
// updatedBy = user who confirms
// confirmedBy = user who confirms
// status = CONFIRMED
```

## Useful Queries

### Get appointments for a provider
```typescript
appointments.find({ userId: providerId })
```

### Get appointments for a client
```typescript
appointments.find({ customerId: clientId })
```

### Get schedules created by an assistant
```typescript
schedules.find({ createdBy: assistantId })
```

### Get appointments confirmed by a specific user
```typescript
appointments.find({ confirmedBy: userId })
```

### Modification audit
```typescript
appointments.find({ 
  updatedBy: userId,
  updatedAt: { $gte: startDate, $lte: endDate }
})
```
