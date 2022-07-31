import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { ScrollMetaDto } from './ScrollMeta.dto';
import { ResponseCommentDto } from '../Comment.response.dto';

export class ResponseScrollCommentsDto {
  @IsArray()
  @ApiProperty({ type: ResponseCommentDto, isArray: true })
  @Type(() => ResponseCommentDto)
  @Expose()
  readonly list: ResponseCommentDto[];

  @ApiProperty({ type: () => ScrollMetaDto })
  @Type(() => ScrollMetaDto)
  @Expose()
  readonly meta: ScrollMetaDto;

  constructor(list: ResponseCommentDto[], meta: ScrollMetaDto) {
    this.list = list;
    this.meta = meta;
  }
}