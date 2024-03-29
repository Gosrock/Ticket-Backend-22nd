import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class ResponseRequestValidationDto {
  @ApiProperty({ description: '요청보낸 전화번호', type: String })
  @Expose()
  phoneNumber: string;

  @ApiProperty({ description: '테스트용 인증번호', type: String })
  // 테스트 서비스 인증번호
  @Expose()
  validationNumber: string;

  @ApiProperty({ description: '이미 가입했는지에대한 정보', type: Boolean })
  @Expose()
  alreadySingUp: boolean;
}
