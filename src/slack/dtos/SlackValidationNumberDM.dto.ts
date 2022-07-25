import { Expose } from 'class-transformer';

export class SlackValidationNumberDMDto {
  /**
   * 인증번호 슬랙 dm 을 위한 생성자
   * @param slackChannelId 보낼사람의 slackChannelId
   * @param validationNumber 인증 번호
   */
  constructor(slackChannelId: string, validationNumber: string) {
    this.slackChannelId = slackChannelId;
    this.validationNumber = validationNumber;
  }

  /**
   * 슬랙 채널아이디 (개인도 채널아이디 있음)
   */
  @Expose()
  slackChannelId: string;

  /**
   * dm으로 보낼 인증번호
   */
  @Expose()
  validationNumber: string;
}
