import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class RequestAdminSendValidationNumberDto {
  // 직렬화
  @ApiProperty({ description: '전화번호형식', type: String })
  @MinLength(11)
  @MaxLength(11)
  @Matches(/010[0-9]*$/, {
    message: '010으로 시작하는 숫자만 들어와야 합니다.'
  })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    description: '고스락 슬랙 채널에 가입되어있는 이메일.',
    type: String
  })
  @IsEmail()
  @Expose()
  slackEmail: string;
}
