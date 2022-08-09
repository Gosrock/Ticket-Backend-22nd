import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';

export class ResponseRandomCommentUserDto {
  @ApiProperty({ description: '댓글 고유 아이디', type: Number})
  @Expose()
  id: number;

  @ApiProperty({ description: '댓글 내옹', type: String })
  @Expose()
  content: string;

  @ApiProperty({ description: '익명 닉네임', type: String })
  @Expose()
  nickName: string;

  @ApiProperty({ description: '응원 코멘트 생성 일자', type: Date })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: '유저 정보', type: UserProfileDto })
  @Expose()
  userInfo: UserProfileDto
}