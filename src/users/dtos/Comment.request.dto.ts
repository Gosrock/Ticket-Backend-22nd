import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RequestCommentDto {
  @ApiProperty({ description: '익명 닉네임', type: String})
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @Expose()
  nickName: string;

  @ApiProperty({ description: '댓글 내용', type: String})
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  @Expose()
  content: string;
}