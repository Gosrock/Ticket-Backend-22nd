import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities/user.entity';
import { AuthService } from './auth.service';
import { RequestPhoneNumberDto } from './dtos/phoneNumber.request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '휴대전화번호 인증번호를 요청한다.' })
  @ApiBody({ type: RequestPhoneNumberDto })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Post('')
  async requestPhoneValidationNumber(
    @Body() requestPhoneNumberDto: RequestPhoneNumberDto
  ) {
    // findOneByUserId
    return await this.authService.requestPhoneValidationNumber(
      requestPhoneNumberDto
    );
  }

  @ApiOperation({ summary: '휴대전화번호 인증번호를 검증한다.' })
  @ApiBody({})
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Post('')
  async validationPhoneNumber() {
    // findOneByUserId
    return await this.authService.saveUser();
  }

  @ApiOperation({ summary: '회원가입한다.' })
  @ApiBody({})
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Post('')
  async signUpUser() {
    // findOneByUserId
    return await this.authService.saveUser();
  }

  @ApiOperation({ summary: '내 정보를 가져온다.' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Get('')
  async getMyUserInfo() {
    // findOneByUserId
    return await this.authService.getAllUsers();
  }

  @ApiOperation({ summary: '내 정보를 가져온다.' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Post('')
  async saveUser() {
    // findOneByUserId
    return await this.authService.saveUser();
  }
}
