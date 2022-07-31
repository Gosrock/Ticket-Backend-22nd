import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { ResponseCommentDto } from './Comment.response.dto';

export class ResponseScrollCommentDto {
  @IsArray()
  @ApiProperty({ type: ResponseCommentDto, isArray: true })
  @Type(() => ResponseCommentDto)
  @Expose()
  readonly list: ResponseCommentDto[];

  //last id, last page(true/false)
}