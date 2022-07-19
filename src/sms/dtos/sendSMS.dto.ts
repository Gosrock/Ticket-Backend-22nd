import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MessageDto } from './message.dto';

export class SendSMSDto {
  // SMS 만 허용 고스락 프로젝트는
  @Expose()
  type = 'SMS';

  // 일반메시지 if AD : 광고메시지
  @Expose()
  contentType = 'COMM';

  // 전화번호 인증 번호
  @Expose()
  from: string;

  // 메시지 배열
  @Expose()
  @Type(() => MessageDto)
  messages: MessageDto;
}
