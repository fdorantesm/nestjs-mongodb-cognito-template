import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty({
    description: 'Permission unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public uuid: string;

  @ApiProperty({
    description: 'Permission name',
    example: 'Read Users',
  })
  public name: string;

  @ApiProperty({
    description: 'Permission code',
    example: 'users.read',
  })
  public code: string;

  @ApiProperty({
    description: 'Permission creation date',
    example: '2025-01-01T00:00:00.000Z',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Permission last update date',
    example: '2025-01-01T00:00:00.000Z',
  })
  public updatedAt: Date;
}
