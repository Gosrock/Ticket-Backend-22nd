import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { RegisterUser } from 'src/common/decorators/registerUser.decorator';
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
import { SuccessResponse } from 'src/common/decorators/SuccessResponse.decorator';
import { AuthErrorDefine } from './Errors/AuthErrorDefine';

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
    AuthErrorDefine['Auth-5000']
  ])
  @ErrorResponse(HttpStatus.TOO_MANY_REQUESTS, [AuthErrorDefine['Auth-9000']])
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
      exampleTitle: '최초 (회원가입 안한 유저일때 )',
      overwriteValue: { registerToken: '요걸 값을 바꿀꺼얌' }
    },
    {
      model: LoginResponseDto,
      exampleDescription: '이미 회원가입한 유저면 accessToken을 발급합니다.',
      exampleTitle: '이미 회원가입한 유저일때',
      overwriteValue: { accessToken: '요걸 값을 바꿀꺼얌ㅋㅋ' }
    }
  ])
  // @ApiExtraModels(FirstReigsterDto, LoginResponseDto)
  // @ApiResponse({
  //   status: 200,
  //   description: 'Successful response',
  //   content: {
  //     'application/json': {
  //       examples: {
  //         예시1: {
  //           value: { example: '예시1' },
  //           description: '예시 1의 응닶갑'
  //         },
  //         예시2: { value: { example: '예시2' }, description: '예시 2의 응닶갑' }
  //       },
  //       schema: {
  //         oneOf: [
  //           { $ref: getSchemaPath(FirstReigsterDto) },
  //           { $ref: getSchemaPath(LoginResponseDto) }
  //         ]
  //       }
  //     }
  //   }
  // })
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine['Auth-0000'],
    AuthErrorDefine['Auth-0001']
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
  @ErrorResponse(HttpStatus.BAD_REQUEST, [AuthErrorDefine['Auth-0002']])
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
    AuthErrorDefine['Auth-0003'],
    AuthErrorDefine['Auth-0004']
  ])
  @ErrorResponse(HttpStatus.TOO_MANY_REQUESTS, [AuthErrorDefine['Auth-9000']])
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
    AuthErrorDefine['Auth-0000'],
    AuthErrorDefine['Auth-0001'],
    AuthErrorDefine['Auth-0005']
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
