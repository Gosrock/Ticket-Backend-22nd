import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MessageDto {
  @ApiProperty({
    description: '메시지 제목. (정의하지 않으면 기본 메시지 제목을 사용)',
    type: String
  })
  @Expose()
  subject?: string;

  @ApiProperty({
    description: '메시지 컨텐츠 내용.',
    type: String
  })
  @Expose()
  content: string;

  @ApiProperty({ description: '수신번호', type: String })
  @Expose()
  to: string;
}
