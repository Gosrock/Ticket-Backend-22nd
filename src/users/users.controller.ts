import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Delete,
  Body,
  HttpStatus
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse
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
import { ScrollOptionsDto } from './dtos/Scroll/ScrollOptions.dto';
import { CommentDto } from './dtos/Comment.dto';
import { ResponseScrollCommentsDto } from './dtos/Scroll/ScrollComments.response.dto';
import { SuccessResponse } from 'src/common/decorators/SuccessResponse.decorator';
import { ResponseUserTicketNumDto } from './dtos/UserTicketNum.response.dto';
import { RequestRandomCommentDto } from './dtos/RandomComment.request.dto';
import { ResponseRandomCommentDto } from './dtos/RandomComment.response.dto';
import { UserFindDto } from './dtos/UserFind.dto';
import { ResponseCommentNumDto } from './dtos/CommentNum.response.dto';
import { ResponseRandomCommentUserDto } from './dtos/RandomCommentUser.response.dto';
import { ErrorResponse } from 'src/common/decorators/ErrorResponse.decorator';
import { AuthErrorDefine } from 'src/auth/Errors/AuthErrorDefine';

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
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [AuthErrorDefine['Auth-1003']])
  @Get('')
  async getMyUserInfo(@ReqUser() user: User) {
    // findOneByUserId
    return await this.userService.getMyInfo(user);
  }

  // 유저 정보 조회(관리자용) 전체 정보 조회
  @ApiOperation({ summary: '[어드민] 모든 유저 정보를 가져온다' })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: PageDto,
      exampleDescription: '마지막 페이지일 때',
      exampleTitle: '마지막페이지',
      generic: ResponseUserTicketNumDto,
      overwriteValue: {
        meta: { hasNextPage: false }
      }
    },
    {
      model: PageDto,
      exampleDescription: '성공 예시',
      exampleTitle: '성공 예시',
      generic: ResponseUserTicketNumDto
    }
  ])
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'AccessToken 권한이 없을 경우'
  })
  @Roles(Role.Admin)
  @Get('/all')
  async getAllUserInfo(
    @Query() userFindDto: UserFindDto,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return await this.userService.getAllUserInfo(userFindDto, pageOptionsDto);
  }

  // 입금자명 수정
  @ApiOperation({ summary: '입금자명 수정' })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: UserProfileDto,
      exampleDescription: '입금자명 변경 성공시',
      exampleTitle: '변경 성공'
    }
  ])
  @Post('/update')
  async changeName(
    @ReqUser() user: User,
    @Body() requestUserNameDto: RequestUserNameDto
  ) {
    return await this.userService.changeName(user, requestUserNameDto);
  }

  // 응원 댓글 생성
  @ApiOperation({ summary: '응원 댓글 생성' })
  @ApiBody({ type: RequestCommentDto })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: ResponseCommentDto,
      exampleDescription: '댓글 생성 성공 시',
      exampleTitle: '댓글 생성 성공'
    }
  ])
  @Post('/comment')
  async makeComment(
    @ReqUser() user: User,
    @Body() requestCommentDto: RequestCommentDto
  ) {
    return await this.userService.makeComment(user, requestCommentDto);
  }

  // 응원 댓글 조회(자기 댓글만 오른쪽에 뜨도록)
  @ApiOperation({ summary: '응원 댓글 조회' })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: ResponseScrollCommentsDto,
      exampleDescription: '마지막 페이지일 시',
      exampleTitle: '마지막 페이지',
      overwriteValue: {
        meta: { lastPage: true }
      }
    },
    {
      model: ResponseScrollCommentsDto,
      exampleDescription: '댓글 스크롤 조회 성공 시',
      exampleTitle: '댓글 조회 성공'
    }
  ])
  @Get('/comment')
  async getAllComment(
    @ReqUser() user: User,
    @Query() scrollOptionsDto: ScrollOptionsDto
  ) {
    return await this.userService.getAllComment(user.id, scrollOptionsDto);
  }

  // 응원 댓글 개수 조회
  @ApiOperation({ summary: '응원 댓글 갯수 조회' })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: ResponseCommentNumDto,
      exampleDescription: '응원 댓글 갯수 조회 성공시',
      exampleTitle: '응원 댓글 갯수 조회 성공'
    }
  ])
  @Get('/comment/count')
  async getCommentNum() {
    return await this.userService.getCommentNum();
  }

  // 댓글 랜덤 조회
  @ApiOperation({ summary: '댓글 랜덤 조회' })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: ResponseRandomCommentDto,
      exampleDescription: '댓글 랜덤 조회 성공 시',
      exampleTitle: '댓글 랜덤 조회'
    }
  ])
  @Get('/random/comment')
  async getRandomComment(
    @Query() requestRandomCommentDto: RequestRandomCommentDto
  ) {
    return await this.userService.getRandomComment(requestRandomCommentDto);
  }

  // 댓글 랜덤 조회(유저 정보 포함)
  @ApiOperation({ summary: '유저 정보 포함 댓글 랜덤 조회' })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: ResponseRandomCommentUserDto,
      exampleDescription: '유저 정보 포함 댓글 랜덤 조회 성공 시',
      exampleTitle: '댓글 랜덤 조회'
    }
  ])
  @Roles(Role.Admin)
  @Get('/random/comment/userInfo')
  async getRandomCommentUser(
    @Query() requestRandomCommentDto: RequestRandomCommentDto
  ) {
    return await this.userService.getRandomCommentUser(requestRandomCommentDto);
  }

  // 응원 댓글 삭제(관리자용)
  @ApiOperation({ summary: '[어드민] 응원 댓글 삭제' })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: CommentDto,
      exampleDescription: '댓글 삭제 성공 시',
      exampleTitle: '댓글 삭제 성공'
    }
  ])
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'AccessToken 권한이 없을 경우'
  })
  @Roles(Role.Admin)
  @Delete('/:id/comment')
  async deleteComment(@Param('id') id: number) {
    return await this.userService.deleteComment(id);
  }
}
