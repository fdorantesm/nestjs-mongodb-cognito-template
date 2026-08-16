import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({
    description: 'Role unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public uuid: string;

  @ApiProperty({
    description: 'Role name',
    example: 'Administrator',
  })
  public name: string;

  @ApiProperty({
    description: 'Role code',
    example: 'admin',
  })
  public code: string;

  @ApiPropertyOptional({
    description: 'Role permissions',
    isArray: true,
    example: ['users.read', 'users.write'],
  })
  public permissions?: string[];

  @ApiProperty({
    description: 'Role creation date',
    example: '2025-01-01T00:00:00.000Z',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Role last update date',
    example: '2025-01-01T00:00:00.000Z',
  })
  public updatedAt: Date;
}
