import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public displayName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public socialLinks?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  public birthday?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public pronouns?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public isPublic?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  public email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  public roleId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  public scopes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public isConfirmed?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public isEmailVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public isPhoneVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public isVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  public profile?: UpdateProfileDto;
}
