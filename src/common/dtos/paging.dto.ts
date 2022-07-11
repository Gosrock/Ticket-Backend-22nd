import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PagingDto {
  @ApiProperty({
    minimum: 1,
    default: 1,
    description: '페이지 (최소값:1)'
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({
    minimum: 1,
    default: 10,
    description: '페이지의 게시물 갯수 (최소값:1)'
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  size: number;
}
