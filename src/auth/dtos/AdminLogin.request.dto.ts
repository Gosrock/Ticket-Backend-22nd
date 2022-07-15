import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsMobilePhone, IsString } from 'class-validator';

export class RequestAdminLoginDto {
  @ApiProperty({ description: '요청보낸 전화번호', type: String })
  @IsMobilePhone()
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    description: '고스락 슬랙 채널에 가입되어있는 이메일.',
    type: String
  })
  @IsEmail()
  @Expose()
  slackEmail: string;

  @ApiProperty({ description: '받은 인증번호', type: String })
  @IsString()
  @Expose()
  validationNumber: string;
}
