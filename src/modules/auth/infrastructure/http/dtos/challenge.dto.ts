import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf, Matches, IsEmail } from 'class-validator';

export class ChallengeDto {
  @ApiProperty({ type: 'string' })
  @IsEmail()
  public readonly username: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  public readonly challengeName: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  public readonly session: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @ValidateIf((o) => o.challengeName === 'EMAIL_OTP')
  @Matches(/^\d{6}$/, {
    message: 'Value must be a 6-digit OTP when challengeName is EMAIL_OTP',
  })
  public readonly value: string;
}
