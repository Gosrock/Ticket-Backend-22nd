import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { RegisterUser } from 'src/common/decorators/registerUser.decorator';
import { User } from 'src/database/entities/user.entity';
import { RegisterJwtPayload } from './auth.interface';
import { AuthService } from './auth.service';
import { RequestAdminLoginDto } from './dtos/AdminLogin.request.dto';
import { ResponseAdminLoginDto } from './dtos/AdminLogin.response.dto';
import { RequestAdminSendValidationNumberDto } from './dtos/AdminSendValidationNumber.request.dto copy';
import { ResponseAdminSendValidationNumberDto } from './dtos/AdminSendValidationNumber.Response.dto';
import { RequestPhoneNumberDto } from './dtos/phoneNumber.request.dto';
import { RequestRegisterUserDto } from './dtos/RegisterUser.request.dto';
import { ResponseRegisterUserDto } from './dtos/RegisterUser.response.dto';
import { ResponseRequestValidationDto } from './dtos/RequestValidation.response.dto';
import { RequestValidateNumberDto } from './dtos/ValidateNumber.request.dto';
import { ResponseValidateNumberDto } from './dtos/ValidateNumber.response.dto';
import { RegisterTokenGuard } from './guards/RegisterToken.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '휴대전화번호 인증번호를 요청한다.' })
  @ApiBody({ type: RequestPhoneNumberDto })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResponseRequestValidationDto
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
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResponseValidateNumberDto
  })
  @Post('message/validate')
  async validationPhoneNumber(
    @Body() requestValidateNumberDto: RequestValidateNumberDto
  ) {
    // findOneByUserId
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
    // return await this.authService.slackLoginUser(requestAdminLoginDto);
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
