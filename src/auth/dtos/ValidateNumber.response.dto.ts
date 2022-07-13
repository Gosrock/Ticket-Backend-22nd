import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMobilePhone, IsString } from 'class-validator';

export class ResponseValidateNumberDto {
  @ApiProperty({
    description: '인증용 토큰, 인증 기한은 삼일입니다.',
    type: String,
    nullable: true
  })
  @Expose()
  accessToken?: string;

  @ApiProperty({
    description:
      '회원 가입용 토큰 , signUp 시에 쓰입니다. 인증기한은 10분입니다.',
    type: String,
    nullable: true
  })
  @Expose()
  registerToken?: string;

  @ApiProperty({
    description:
      '이미 가입했는지에대한 정보, 인증용 토큰, 회원가입용 토큰 분기처리용',
    type: Boolean
  })
  @Expose()
  alreadySingUp: boolean;
}
