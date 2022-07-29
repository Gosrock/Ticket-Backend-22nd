import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiPropertyOptions,
  ApiResponse,
  ApiTags,
  getSchemaPath,
  refs
} from '@nestjs/swagger';
import { RegisterUser } from 'src/common/decorators/registerUser.decorator';
import { makeInstanceByApiProperty } from 'src/common/utils/makeInstanceByApiProperty';
import { User } from 'src/database/entities/user.entity';
import { RegisterJwtPayload } from './auth.interface';
import { AuthService } from './auth.service';
import { RequestAdminLoginDto } from './dtos/AdminLogin.request.dto';
import { ResponseAdminLoginDto } from './dtos/AdminLogin.response.dto';
import { RequestAdminSendValidationNumberDto } from './dtos/AdminSendValidationNumber.request.dto copy';
import { ResponseAdminSendValidationNumberDto } from './dtos/AdminSendValidationNumber.response.dto';
import { RequestPhoneNumberDto } from './dtos/phoneNumber.request.dto';
import { RequestRegisterUserDto } from './dtos/RegisterUser.request.dto';
import { ResponseRegisterUserDto } from './dtos/RegisterUser.response.dto';
import { ResponseRequestValidationDto } from './dtos/RequestValidation.response.dto';
import { RequestValidateNumberDto } from './dtos/ValidateNumber.request.dto';
import { RegisterTokenGuard } from './guards/RegisterToken.guard';
import { ThrottlerBehindProxyGuard } from './guards/TrottlerBehindProxy.guard';
import { FirstReigsterDto } from './dtos/FirstRegister.response.dto copy';
import { LoginResponseDto } from './dtos/Login.response.dto';
import { ErrorResponse } from 'src/common/decorators/ErrorResponse.decorator';
import { ThrottlerException } from '@nestjs/throttler';
import { SuccessResponse } from 'src/common/decorators/SuccessResponse.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerBehindProxyGuard)
  @ApiOperation({ summary: '휴대전화번호 인증번호를 요청한다.' })
  @ApiBody({ type: RequestPhoneNumberDto })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: ResponseRequestValidationDto,
      overwriteValue: {
        alreadySingUp: true
      },
      exampleDescription:
        '이미 가입한 사람이 요청번호를 보내면 alreadySingUp 이 true 입니다.',
      exampleTitle: '인증번호-이미가입한사람'
    },
    {
      model: ResponseRequestValidationDto,
      overwriteValue: {
        alreadySingUp: false
      },
      exampleDescription:
        '처음 회원가입한 사람이 요청번호를 보내면 alreadySingUp 이 false 입니다.',
      exampleTitle: '인증번호-처음회원가입'
    }
  ])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [
    {
      model: InternalServerErrorException,
      exampleDescription: '문자메시지 발송이 실패하면 발생합니다.',
      exampleTitle: '문자메시지 발송실패 오류',
      exampleMessageInfo:
        '문자메시지 발송 실패. 고스락 카카오톡 채널을 활용해서 관리자한테 연락 부탁드립니다.'
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
  @Post('message/send')
  async requestPhoneValidationNumber(
    @Body() requestPhoneNumberDto: RequestPhoneNumberDto
  ) {
    // findOneByUserId
    return await this.authService.requestPhoneValidationNumber(
      requestPhoneNumberDto
    );
  }

  @ApiOperation({ summary: '휴대전화번호 인증번호를 검증한다.' })
  @ApiBody({ type: RequestValidateNumberDto })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: FirstReigsterDto,
      exampleDescription:
        '리턴된 registerToken을 Bearer <registerToken> 형식으로 집어넣으시면됩니다.',
      exampleTitle: '최초 (회원가입 안한 유저일때 )'
    },
    {
      model: LoginResponseDto,
      exampleDescription: '이미 회원가입한 유저면 accessToken을 발급합니다.',
      exampleTitle: '이미 회원가입한 유저일때'
    }
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    {
      model: BadRequestException,
      exampleDescription: '3분짜리 인증번호 기한만료시에 발생하는 오류',
      exampleTitle: '인증번호-기한만료',
      exampleMessageInfo: '인증번호가 기한만료 되었습니다.'
    },
    {
      model: BadRequestException,
      exampleDescription: '인증번호가 일치하지 않으면 발생하는 오류',
      exampleTitle: '인증번호-불일치',
      exampleMessageInfo: '인증번호가 일치하지 않습니다.'
    }
  ])
  @Post('message/validate')
  async validationPhoneNumber(
    @Body() requestValidateNumberDto: RequestValidateNumberDto
  ) {
    return await this.authService.validationPhoneNumber(
      requestValidateNumberDto
    );
  }

  @ApiBearerAuth('registerToken')
  @ApiOperation({ summary: '회원가입한다.' })
  @ApiBody({ type: RequestRegisterUserDto })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: ResponseRegisterUserDto,
      overwriteValue: {
        accessToken: '어 세 스 토 큰 임니다',
        user: { id: '고유 아이디입니당 ' }
      },
      exampleDescription: '설명',
      exampleTitle: '회원가입-성공'
    }
  ])
  @UseGuards(RegisterTokenGuard)
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    {
      model: BadRequestException,
      exampleDescription: '중복해서 회원가입을 시도하면 막습니다.',
      exampleTitle: '중복회원가입요청',
      exampleMessageInfo: '이미 회원가입한 유저입니다.'
    }
  ])
  @Post('register')
  async registerUser(
    @RegisterUser() registerUser: RegisterJwtPayload,
    @Body() requestRegisterUserDto: RequestRegisterUserDto
  ) {
    // findOneByUserId
    return await this.authService.registerUser(
      registerUser,
      requestRegisterUserDto
    );
  }

  @UseGuards(ThrottlerBehindProxyGuard)
  @ApiOperation({ summary: '슬랙 인증번호를 발송한다 (관리자 용 )' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResponseAdminSendValidationNumberDto
  })
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    {
      model: BadRequestException,
      exampleDescription: '슬랙에 등록되지않은 유저일때 발생하는 오류',
      exampleTitle: '정보오류-유저정보,슬랙정보없음',
      exampleMessageInfo: '가입한 유저나 어드민 유저가 아닙니다.'
    },
    {
      model: BadRequestException,
      exampleDescription: '받은 슬랙이메일이 올바르지않을경우',
      exampleTitle: '정보오류-슬랙정보없음',
      exampleMessageInfo: '가입한 슬랙 이메일을 올바르게 입력해 주세요'
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
  @ApiBody({ type: RequestAdminSendValidationNumberDto })
  @Post('/slack/send')
  async slackSendValidationNumber(
    @Body()
    requestAdminSendValidationNumberDto: RequestAdminSendValidationNumberDto
  ) {
    // findOneByUserId
    return await this.authService.slackSendValidationNumber(
      requestAdminSendValidationNumberDto
    );
  }

  @ApiOperation({ summary: '슬랙 인증번호를 검증한다' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시 로그인 처리',
    type: ResponseAdminLoginDto
  })
  @ApiBody({ type: RequestAdminLoginDto })
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    {
      model: BadRequestException,
      exampleDescription: '3분짜리 인증기한이 지났을때',
      exampleTitle: '인증번호-기한만료',
      exampleMessageInfo: '인증 기한이 지났습니다.'
    },
    {
      model: BadRequestException,
      exampleDescription: '인증번호가 맞지 않을때',
      exampleTitle: '인증번호-검증오류',
      exampleMessageInfo: '인증 번호가 맞지 않습니다.'
    },
    {
      model: BadRequestException,
      exampleDescription: '가입한 유저나 어드민 유저가 아닐때',
      exampleTitle: '인증번호-검증이후',
      exampleMessageInfo: '가입한 유저나 어드민 유저가 아닙니다.'
    }
  ])
  @Post('/slack/validation')
  async slackLoginUser(
    @Body()
    requestAdminLoginDto: RequestAdminLoginDto
  ) {
    // findOneByUserId
    return await this.authService.slackLoginUser(requestAdminLoginDto);
  }

  // @ApiOperation({ summary: '내 정보를 가져온다.' })
  // @ApiResponse({
  //   status: 200,
  //   description: '요청 성공시',
  //   type: User
  // })
  // @Post('')
  // async saveUser() {
  //   // findOneByUserId
  //   return await this.authService.saveUser();
  // }
}
