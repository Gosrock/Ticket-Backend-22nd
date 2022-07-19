/**
 * sms 모듈을 임포트할때 설정하는 옵션
 * 2022-07-19 이찬진
 */
export interface SMSOption {
  // 실제로 메시지를 보내는 것을 원치 않으면
  // 실 서버에서만 문자를 보내도록 함
  isProd: boolean;
}
