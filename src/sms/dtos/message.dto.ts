import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MessageDto {
  /**
   * 메시지를 보낼 Dto
   * @param to 보낼 사람 전화번호 - 없이
   * @param content 보낼 내용
   */
  constructor(to: string, content: string) {
    this.to = to;
    this.content = content;
  }

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
