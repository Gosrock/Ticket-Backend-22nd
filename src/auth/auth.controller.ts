import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerBehindProxyGuard)
  @ApiOperation({ summary: '휴대전화번호 인증번호를 요청한다.' })
  @ApiBody({ type: RequestPhoneNumberDto })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResponseRequestValidationDto
  })
  @ApiResponse({
    status: 429,
    description: '과도한 요청을 보낼시에'
  })
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
  @ApiExtraModels(LoginResponseDto)
  @ApiExtraModels(FirstReigsterDto)
  @ApiResponse({
    description:
      '최초회원가입 한 유저면 registerToken을 , 이후 로그인 한 사람이면 accessToken을 발급합니다.',
    content: {
      'application/json': {
        schema: {
          oneOf: [
            { $ref: getSchemaPath(FirstReigsterDto) },
            { $ref: getSchemaPath(LoginResponseDto) }
          ]
        },
        examples: {
          '최초 (회원가입 안한 유저일때 )': {
            value: makeInstanceByApiProperty(FirstReigsterDto),
            description:
              '리턴된 registerToken을 Bearer <registerToken> 형식으로 집어넣으시면됩니다.'
          },
          '이미 회원가입한 유저일때': {
            value: makeInstanceByApiProperty(LoginResponseDto)
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청'
  })
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
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResponseRegisterUserDto
  })
  @UseGuards(RegisterTokenGuard)
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
  @ApiResponse({
    status: 400,
    description: '슬랙에 들어와있는 유저가 아닐때 , 어드민 유저가 아닐 때'
  })
  @ApiResponse({
    status: 429,
    description: '과도한 요청을 보낼시에'
  })
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
  @ApiResponse({
    status: 400,
    description: 'send 요청을 보낸 사용자가 아닐때 또는 인증번호가 잘못되었을때'
  })
  @ApiBody({ type: RequestAdminLoginDto })
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
