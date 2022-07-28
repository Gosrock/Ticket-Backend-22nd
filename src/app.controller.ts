import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerException } from '@nestjs/throttler';
import { Role } from 'src/common/consts/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/database/entities/user.entity';
import { ErrorResponse } from './common/decorators/ErrorResponse.decorator';
import { ErrorCommonResponse } from './common/errors/ErrorCommonResponse.dto';
import { HttpExceptionErrorResponseDto } from './common/errors/HttpExceptionError.response.dto';
import { CustomValidationError } from './common/errors/ValidtionError';
@Controller()
@ApiTags('common')
export class CommonController {
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    {
      model: BadRequestException,
      exampleDescription: 'http공통오류입니다.',
      exampleTitle: 'http공통오류입니다.',
      exampleMessageInfo: '에러메시지'
    },
    {
      model: CustomValidationError,
      exampleDescription: 'asdfasdfasdfasdf',
      exampleTitle: 'asdfasdfasdfasdfasdf.',
      exampleMessageInfo: { field: ['어떤에러'] }
    }
  ])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    {
      model: UnauthorizedException,
      exampleDescription: 'http공통오류입니다.',
      exampleTitle: 'http공통오류입니다.',
      exampleMessageInfo: '에러메시지'
    },
    {
      model: UnauthorizedException,
      exampleDescription: 'zzz',
      exampleTitle: 'asdfasdf.',
      exampleMessageInfo: '에러메시지'
    }
  ])
  @ErrorResponse(HttpStatus.FORBIDDEN, [
    {
      model: UnauthorizedException,
      exampleDescription: 'http공통오류입니다.',
      exampleTitle: 'http공통오류입니다.',
      exampleMessageInfo: '에러메시지'
    },
    {
      model: CustomValidationError,
      exampleDescription: 'zzz',
      exampleTitle: 'asdfasdf.',
      exampleMessageInfo: { field: ['어떤에러'] }
    }
  ])
  @ErrorResponse(HttpStatus.TOO_MANY_REQUESTS, [
    {
      model: ThrottlerException,
      exampleDescription: 'http공통오류입니다.',
      exampleTitle: 'http공통오류입니다.',
      exampleMessageInfo: '에러메시지'
    }
  ])
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
