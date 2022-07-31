import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ScrollOptionsDto {
  @ApiProperty({ description: '현재 페이지의 마지막 id', nullable: true })
  @Expose()
  readonly lastId: number;
}