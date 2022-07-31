import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Exclude, Type } from 'class-transformer';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';

export class ResponseCommentDto {
  @ApiProperty({ description: '댓글 고유 아이디', type: Number})
  @Expose()
  id: number;

  @ApiProperty({ description: '댓글 내옹', type: String })
  @Expose()
  content: string;

  @ApiProperty({ description: '익명 닉네임', type: String })
  @Expose()
  nickName: string;

  @ApiProperty({ description: '유저 정보', type: UserProfileDto})
  @Type(() => UserProfileDto)
  @Expose()
  user: UserProfileDto;

  @ApiProperty({ description: '응원 코멘트 생성 일자', type: Date })
  @Expose()
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  iUserId: number;

  @ApiProperty({ description: '본인 댓글 확인 정보', type: Boolean })
  @ApiPropertyOptional({ default: true })
  @Expose()
  get iComment(): boolean {
    if (this.user.id === this.iUserId){
      return true;
    } else {
      return false;
    }
  } ;
}