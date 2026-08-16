import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class ConfirmRegisterDto {
  @ApiProperty({ type: 'string' })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ type: 'string' })
  @Matches(/^\d{6}$/)
  public readonly confirmationCode: string;
}
