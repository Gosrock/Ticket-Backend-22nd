import { Controller, Get, Param, Post, Query, UseGuards, Patch, Req, Delete, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/AccessToken.guard';
import { Role } from 'src/common/consts/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/database/entities/user.entity';
import { RequestUserNameDto } from './dtos/UserName.request.dto';
import { UsersService } from './users.service';
import { RequestCommentDto } from './dtos/Comment.request.dto';
import { ResponseCommentDto } from './dtos/Comment.response.dto';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';

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
    type: UserProfileDto
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
    type: PageDto
  })
  @Roles(Role.Admin)
  @Get('/all')
  async getAllUserInfo(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.userService.getAllUserInfo(pageOptionsDto);
  }

  // 입금자명 수정
  @ApiOperation({ summary: '입금자명 수정' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Post('/update')
  async changeName(@ReqUser() user: User, @Body() requestUserNameDto: RequestUserNameDto) {
    return await this.userService.changeName(user, requestUserNameDto);
  }

  // 응원 댓글 생성
  @ApiOperation({ summary: '응원 댓글 생성' })
  @ApiBody({ type: RequestCommentDto })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: User
  })
  @Post('/comment')
  async makeComment(@ReqUser() user: User, @Body() requestCommentDto: RequestCommentDto) {
    return await this.userService.makeComment(user, requestCommentDto);
  }

  // 응원 댓글 조회(자기 댓글만 오른쪽에 뜨도록)
  @ApiOperation({ summary: '응원 댓글 조회' })
  @ApiResponse({
    status: 200,
    description: '요청 성공시',
    type: ResponseCommentDto
  })
  @Get('/comment')
  async getAllComment(@ReqUser() user: User) {
    return await this.userService.getAllComment(user.id);
  }

  // 응원 댓글 삭제(관리자용)
  @Roles(Role.Admin)
  @Delete('/:id/comment')
  async deleteComment(@Param('id') id: number) {
    return await this.userService.deleteComment(id);
  }

}