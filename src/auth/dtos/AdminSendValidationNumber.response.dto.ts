import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ResponseAdminSendValidationNumberDto {
  // 직렬화

  @ApiProperty({
    description: '테스트용 인증번호',
    type: String,
    isArray: true,
    example: 'asdf'
  })
  @Exclude()
  validationNumber: string;
}
