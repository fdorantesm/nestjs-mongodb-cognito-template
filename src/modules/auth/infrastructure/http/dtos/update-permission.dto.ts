import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public code?: string;
}
