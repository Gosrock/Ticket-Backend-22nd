import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsMobilePhone } from 'class-validator';

export class ResponseAdminSendValidationNumberDto {
  // 직렬화

  @ApiProperty({
    description: '테스트용 인증번호',
    type: String,
    isArray: true,
    example: 'asdf'
  })
  @Expose()
  validationNumber: string;
}
