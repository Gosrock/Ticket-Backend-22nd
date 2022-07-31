import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ScrollOptionsDto } from './ScrollOptions.dto';

export class ScrollMetaDto {
  @ApiProperty({ description: '현재 페이지의 마지막 id', nullable: true })
  @Expose()
  readonly lastId: number | null;

  @ApiProperty({ description: '현재 페이지가 마지막페이지인지에 대한 정보' })
  @Expose()
  readonly lastPage: boolean;

  constructor(lastId: number | null, lastPage: boolean) {
    this.lastId = lastId;
    this.lastPage = lastPage;
  }
}
