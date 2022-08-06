import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseCommentNumDto {
  @ApiProperty({
    description: '응원 댓글 개수',
    type: Number
  })
  @Expose()
  public commentNum: number;
}