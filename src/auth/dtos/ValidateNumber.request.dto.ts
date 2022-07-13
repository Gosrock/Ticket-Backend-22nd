import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMobilePhone, IsString } from 'class-validator';

export class RequestValidateNumberDto {
  @ApiProperty({ description: '요청보낸 전화번호', type: String })
  @IsMobilePhone()
  @Expose()
  phoneNumber: string;

  @ApiProperty({ description: '받은 인증번호', type: String })
  @IsString()
  @Expose()
  validationNumber: string;
}
