import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from './pagination-query.dto';

export class ListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  public sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  public sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'search term',
  })
  @IsOptional()
  @IsString()
  public search?: string;
}
