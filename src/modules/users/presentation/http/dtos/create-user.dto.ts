import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public displayName: string;

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

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public username?: string;

  @ApiProperty()
  @IsUUID()
  public roleId: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  public scopes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  public profile?: CreateProfileDto;
}
