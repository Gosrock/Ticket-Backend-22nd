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
import { AuthErrorDefine } from './auth/Errors/AuthErrorDefine';

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
      message: '에러메시지 형식이 옵니다.'
    },
    {
      model: CustomValidationError,
      exampleDescription: '400번 ValidationError',
      exampleTitle: '400번 ValidationError',
      message: {
        '검증오류가난 필드': ['어떤에러', '어떤에러2'],
        '검증오류가난 필드2': ['어떤에러3', '어떤에러4']
      }
    }
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine['Auth-1000'],
    AuthErrorDefine['Auth-1001'],
    AuthErrorDefine['Auth-1002'],
    AuthErrorDefine['Auth-1003']
  ])
  @ErrorResponse(HttpStatus.FORBIDDEN, [AuthErrorDefine['Auth-3000']])
  @ErrorResponse(HttpStatus.TOO_MANY_REQUESTS, [AuthErrorDefine['Auth-9000']])
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
