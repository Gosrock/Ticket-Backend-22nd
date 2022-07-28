import { Controller, Get, Param, Post, Query, UseGuards, Patch, Req, Delete, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/AccessToken.guard';
import { Role } from 'src/common/consts/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/database/entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('accessToken')
@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: '내 유저정보를 얻어온다' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Get('')
  async getMyUserInfo(@ReqUser() user: User) {
    // findOneByUserId
    return await this.userService.getMyInfo(user);
  }

  @ApiOperation({ summary: '내 유저정보를 얻어온다' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Roles(Role.Admin)
  @Get('/role')
  async getRole(@ReqUser() user: User) {
    // findOneByUserId
    return await this.userService.getMyInfo(user);
  }

  //유저 롤 변경하는 테스트용 함수입니다
  @Post('/role')
  async changeRole(@Query('userId') userId: number, @Query('role') role: Role) {
    return await this.userService.changeRole(userId, role);
  }
  //유저 롤 변경하는 테스트용 함수입니다

  // 유저 정보 조회(관리자용) 전체 정보 조회
  @ApiOperation({ summary: '모든 유저 정보를 가져온다(관리자 권한)' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Roles(Role.Admin)
  @Get('/all')
  async getAllUserInfo() {
    return await this.userService.getAllUserInfo();
  }
}