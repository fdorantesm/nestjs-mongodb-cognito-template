import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public uuid: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  public email: string;

  @ApiProperty({
    description: 'Whether the user email is confirmed',
    example: true,
  })
  public isConfirmed: boolean;

  @ApiProperty({
    description: 'User creation date',
    example: '2025-01-01T00:00:00.000Z',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2025-01-01T00:00:00.000Z',
  })
  public updatedAt: Date;
}
