import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PageMetaDtoParameters } from './page-meta-dto.interface';

export class PageMetaDto {
  @ApiProperty({ description: '페이지 정보입니다.' })
  @Expose()
  readonly page: number;

  @ApiProperty({ description: '몇개를 받아가는지 한페이지 당 원소갯수' })
  @Expose()
  readonly take: number;

  @ApiProperty({ description: '총 아이템 숫자 ( 검색 조건에 맞는 )' })
  @Expose()
  readonly itemCount: number;

  @ApiProperty({ description: '총 페이지 숫자 ( 검색 조건에 맞는 )' })
  @Expose()
  readonly pageCount: number;

  @ApiProperty({ description: '이전페이지가 있는지에 대한정보' })
  @Expose()
  readonly hasPreviousPage: boolean;

  @ApiProperty({ description: '다음페이지가 있는지에 대한 정보' })
  @Expose()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
