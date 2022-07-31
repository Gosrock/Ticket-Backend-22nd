import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ScrollOptionsDto } from './ScrollOptions.dto';

export class ScrollMetaDto {
  @ApiProperty({ description: '페이지 정보입니다.' })
  @Expose()
  readonly page: number;

  @ApiProperty({ description: '몇개를 받아가는지 한페이지 당 원소갯수' })
  @Expose()
  readonly take: number;

  @ApiProperty({ description: '총 아이템 숫자' })
  @Expose()
  readonly itemCount: number;

  @ApiProperty({ description: '총 페이지 숫자' })
  @Expose()
  readonly pageCount: number;

  @ApiProperty({ description: '현재 페이지의 마지막 id', nullable: true })
  @Expose()
  readonly lastId: number;

  @ApiProperty({ description: '현재 페이지가 마지막페이지인지에 대한 정보'})
  @Expose()
  readonly lastPage: boolean;

  constructor(scrollOptionsDto: ScrollOptionsDto, itemCount: number, lastId: number) {
    this.page = scrollOptionsDto.page;
    this.take = scrollOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.lastId = lastId;
    this.lastPage = this.page >= this.pageCount;
  }
}
