import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMobilePhone } from 'class-validator';

export class RequestValidateNumberDto {
  @ApiProperty({ description: '요청보낸 전화번호', type: String })
  @Expose()
  phoneNumber: string;

  @ApiProperty({ description: '테스트용 인증번호', type: String })
  @Expose()
  validationNumber: string;

  @ApiProperty({ description: '이미 가입했는지에대한 정보', type: Boolean })
  @Expose()
  alreadySingUp: boolean;
}
