/* eslint-disable @typescript-eslint/no-empty-function */
import { LoggerService } from '@nestjs/common';

/**
 * 로그를 끌 시에 아무것도 안하기위한 fake Logger
 * redis module 에서 사용
 * 2022-07-13 이찬진
 */
export class FakeLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {}
  error(message: any, ...optionalParams: any[]) {}
  warn(message: any, ...optionalParams: any[]) {}
  debug?(message: any, ...optionalParams: any[]) {}
  verbose?(message: any, ...optionalParams: any[]) {}
}
