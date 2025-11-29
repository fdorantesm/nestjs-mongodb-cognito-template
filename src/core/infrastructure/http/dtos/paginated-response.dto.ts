import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'List of items',
    isArray: true,
  })
  public items: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  public total: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  public limit: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  public page: number | undefined;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  public pages: number | undefined;

  @ApiProperty({
    description: 'Offset for pagination',
    example: 0,
  })
  public offset: number | undefined;

  @ApiProperty({
    description: 'Next page number',
    example: 2,
    nullable: true,
  })
  public nextPage: number | null;

  @ApiProperty({
    description: 'Previous page number',
    example: null,
    nullable: true,
  })
  public prevPage: number | null;

  @ApiProperty({
    description: 'Whether there are more items',
    example: true,
  })
  public hasMore: boolean;
}
