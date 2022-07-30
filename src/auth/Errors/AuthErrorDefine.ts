import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ErrorResponseOption } from 'src/common/decorators/ErrorResponse.decorator';
type Keys =
  | 'Auth-1000'
  | 'Auth-1001'
  | 'Auth-1002'
  | 'Auth-1003'
  | 'Auth-3000'
  | 'Auth-9000'
  | 'Auth-5000'
  | 'Auth-0000'
  | 'Auth-0001'
  | 'Auth-0002'
  | 'Auth-0003'
  | 'Auth-0004'
  | 'Auth-0005';

export const AuthErrorDefine: Record<
  Keys,
  ErrorResponseOption & { code: string }
> = {
  //400
  'Auth-0000': {
    model: BadRequestException,
    exampleDescription: '3분짜리 인증번호 기한만료시에 발생하는 오류',
    exampleTitle: '인증번호-기한만료',
    message: '인증번호가 기한만료 되었습니다.',
    code: 'Auth-0000'
  },
  'Auth-0001': {
    model: BadRequestException,
    exampleDescription: '인증번호가 일치하지 않으면 발생하는 오류',
    exampleTitle: '인증번호-불일치',
    message: '인증번호가 일치하지 않습니다.',
    code: 'Auth-0001'
  },
  'Auth-0002': {
    model: BadRequestException,
    exampleDescription: '중복해서 회원가입을 시도하면 막습니다.',
    exampleTitle: '중복회원가입요청',
    message: '이미 회원가입한 유저입니다.',
    code: 'Auth-0002'
  },

  'Auth-0003': {
    model: BadRequestException,
    exampleDescription: '슬랙에 등록되지않은 유저일때 발생하는 오류',
    exampleTitle: '정보오류-유저정보,슬랙정보없음',
    message: '가입한 유저나 어드민 유저가 아닙니다.',
    code: 'Auth-0003'
  },
  'Auth-0004': {
    model: BadRequestException,
    exampleDescription: '받은 슬랙이메일이 올바르지않을경우',
    exampleTitle: '정보오류-슬랙정보없음',
    message: '가입한 슬랙 이메일을 올바르게 입력해 주세요',
    code: 'Auth-0004'
  },

  'Auth-0005': {
    model: BadRequestException,
    exampleDescription: '가입한 유저나 어드민 유저가 아닐때',
    exampleTitle: '인증번호-검증이후',
    message: '가입한 유저나 어드민 유저가 아닙니다.',
    code: 'Auth-0005'
  },

  //401
  'Auth-1000': {
    model: UnauthorizedException,
    exampleDescription: '헤더 Bearer 형식을 지키지 않고 잘못 요청 보냈을 때',
    exampleTitle: '어세스토큰-잘못된 헤더 요청',
    message: '잘못된 헤더 요청',
    code: 'Auth-1000'
  },

  'Auth-1001': {
    model: UnauthorizedException,
    exampleDescription:
      '손상되거나 Bearer 형식은 맞췄는데 토큰이 이상한 토큰일 때',
    exampleTitle: '어세스토큰-잘못된 토큰',
    message: '잘못된 토큰',
    code: 'Auth-1001'
  },

  'Auth-1002': {
    model: UnauthorizedException,
    exampleDescription: '기한이 지난 토큰일때',
    exampleTitle: '어세스토큰-기한만료',
    message: '기한만료',
    code: 'Auth-1002'
  },
  'Auth-1003': {
    model: UnauthorizedException,
    exampleDescription:
      '어세스토큰은 살아있지만 db에서 유저가 삭제되었을때 (테스트할때 발생할수있는 오류)',
    exampleTitle: '어세스토큰-유저없음',
    message: '없는 유저입니다.',
    code: 'Auth-1003'
  },

  //403
  'Auth-3000': {
    model: ForbiddenException,
    exampleDescription: '일반 유저가 관리자의 메소드에 접근 하려고 할때',
    exampleTitle: '관리자메소드에 유저가 접근',
    message: '권한이 없습니다.',
    code: 'Auth-3000'
  },

  //500
  'Auth-5000': {
    model: InternalServerErrorException,
    exampleDescription: '문자메시지 발송이 실패하면 발생합니다.',
    exampleTitle: '문자메시지 발송실패 오류',
    message:
      '문자메시지 발송 실패. 고스락 카카오톡 채널을 활용해서 관리자한테 연락 부탁드립니다.',
    code: 'Auth-5000'
  },

  // 스로틀
  'Auth-9000': {
    model: ThrottlerException,
    exampleDescription:
      '과도한 요청을 보낼시에 ( 인증문자 요청 , 관리자 슬랙 인증 요청',
    exampleTitle: '과도한 요청',
    message: 'ThrottlerException: Too Many Requests',
    code: 'Auth-9000'
  }
};
