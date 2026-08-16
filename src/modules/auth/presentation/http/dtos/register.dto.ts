import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegistrationDto {
  @ApiProperty({ type: 'string' })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ example: 'MyPassword123*' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  public readonly password: string;

  @ApiProperty({ example: 'myusername' })
  @IsString()
  @Length(3, 16, {
    message: 'Username must be between 3 and 20 characters long.',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  public readonly username: string;

  @ApiProperty({ example: 'My Display Name' })
  @IsString()
  public readonly displayName: string;

  @ApiProperty({ example: '+525512345678', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +525512345678)',
  })
  public readonly phone?: string;
}
