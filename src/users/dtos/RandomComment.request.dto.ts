import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RequestRandomCommentDto {
  @ApiProperty({ description: '가져올 댓글 개수', type: Number })
  @Expose()
  readonly take: number;
}
