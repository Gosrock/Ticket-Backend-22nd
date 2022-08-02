import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';
import { User } from 'src/database/entities/user.entity';

export class ResponseAdminLoginDto {
  @ApiProperty({ description: '유저 정보입니다.', type: UserProfileDto })
  @Type(() => UserProfileDto)
  @Expose()
  user: User;

  @ApiProperty({
    description: '인증용 토큰, 인증 기한은 삼일입니다.',
    type: String,
    nullable: true
  })
  @Expose()
  accessToken: string;
}
