import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  UnauthorizedException
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThrottlerException } from '@nestjs/throttler';

import { ErrorResponse } from './common/decorators/ErrorResponse.decorator';
import { CustomValidationError } from './common/errors/ValidtionError';
@Controller()
@ApiTags('common')
export class CommonController {
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    {
      model: BadRequestException,
      exampleDescription: '400번 BadRequestException',
      exampleTitle: '400 번의 BadRequestException',
      exampleMessageInfo: '에러메시지 형식이 옵니다.'
    },
    {
      model: CustomValidationError,
      exampleDescription: '400번 ValidationError',
      exampleTitle: '400번 ValidationError',
      exampleMessageInfo: {
        '검증오류가난 필드': ['어떤에러', '어떤에러2'],
        '검증오류가난 필드2': ['어떤에러3', '어떤에러4']
      }
    }
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    {
      model: UnauthorizedException,
      exampleDescription: '헤더 Bearer 형식을 지키지 않고 잘못 요청 보냈을 때',
      exampleTitle: '어세스토큰-잘못된 헤더 요청',
      exampleMessageInfo: '잘못된 헤더 요청'
    },
    {
      model: UnauthorizedException,
      exampleDescription:
        '손상되거나 Bearer 형식은 맞췄는데 토큰이 이상한 토큰일 때',
      exampleTitle: '어세스토큰-잘못된 토큰',
      exampleMessageInfo: '잘못된 토큰'
    },
    {
      model: UnauthorizedException,
      exampleDescription: '기한이 지난 토큰일때',
      exampleTitle: '어세스토큰-기한만료',
      exampleMessageInfo: '기한만료'
    },
    {
      model: UnauthorizedException,
      exampleDescription:
        '어세스토큰은 살아있지만 db에서 유저가 삭제되었을때 (테스트할때 발생할수있는 오류)',
      exampleTitle: '어세스토큰-유저없음',
      exampleMessageInfo: '없는 유저입니다.'
    }
  ])
  @ErrorResponse(HttpStatus.FORBIDDEN, [
    {
      model: ForbiddenException,
      exampleDescription: '일반 유저가 관리자의 메소드에 접근 하려고 할때',
      exampleTitle: '관리자메소드에 유저가 접근',
      exampleMessageInfo: '권한이 없습니다.'
    }
  ])
  @ErrorResponse(HttpStatus.TOO_MANY_REQUESTS, [
    {
      model: ThrottlerException,
      exampleDescription:
        '과도한 요청을 보낼시에 ( 인증문자 요청 , 관리자 슬랙 인증 요청',
      exampleTitle: '과도한 요청',
      exampleMessageInfo: 'ThrottlerException: Too Many Requests'
    }
  ])
  @ApiOperation({ summary: '공통 오류에 대해서 정의 합니다.' })
  @Get()
  commen() {}
}
// {
//   검증오류: {
//     value: makeInstanceByApiProperty(
//       ErrorCommonResponse<ValidationErrorResponseDto>,
//       ValidationErrorResponseDto
//     ),
//     description:
//       '리턴된 registerToken을 Bearer <registerToken> 형식으로 집어넣으시면됩니다.'
//   },
//   'http 오류': {
//     value: makeInstanceByApiProperty(
//       ErrorCommonResponse<HttpExceptionErrorResponseDto>,
//       HttpExceptionErrorResponseDto
//     ),
//     description:
//       '리턴된 registerToken을 Bearer <registerToken> 형식으로 집어넣으시면됩니다.'
//   }
//   // '이미 회원가입한 유저일때': {
//   //   value: makeInstanceByApiProperty(LoginResponseDto)
//   // }
// }
