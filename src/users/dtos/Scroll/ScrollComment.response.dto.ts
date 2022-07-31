import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { ScrollMetaDto } from './ScrollMeta.dto';
import { CommentDto } from '../Comment.dto';

export class ResponseScrollCommentDto {
  @IsArray()
  @ApiProperty({ type: CommentDto, isArray: true })
  @Type(() => CommentDto)
  @Expose()
  readonly list: CommentDto[];

  @ApiProperty({ type: () => ScrollMetaDto })
  @Type(() => ScrollMetaDto)
  @Expose()
  readonly meta: ScrollMetaDto;

  constructor(list: CommentDto[], meta: ScrollMetaDto) {
    this.list = list;
    this.meta = meta;
  }
}