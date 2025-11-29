import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRolePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public roleId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public permissionId: string;
}
