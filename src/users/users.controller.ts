import { Controller, Get, UseGuards } from '@nestjs/common';
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
    return await this.userService.testGetUser(user);
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
    return await this.userService.testGetUser(user);
  }
}
