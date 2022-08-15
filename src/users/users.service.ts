import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RequestUserNameDto } from './dtos/UserName.request.dto';
import { CommentRepository } from 'src/database/repositories/comment.repository';
import { RequestCommentDto } from './dtos/Comment.request.dto';
import { plainToInstance } from 'class-transformer';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { ResponseCommentDto } from './dtos/Comment.response.dto';
import { ResponseUserTicketNumDto } from './dtos/UserTicketNum.response.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { ScrollOptionsDto } from './dtos/Scroll/ScrollOptions.dto';
import { ResponseScrollCommentsDto } from './dtos/Scroll/ScrollComments.response.dto';
import { RequestRandomCommentDto } from './dtos/RandomComment.request.dto';
import { UserFindDto } from './dtos/UserFind.dto';
import { AuthErrorDefine } from 'src/auth/Errors/AuthErrorDefine';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private commentRepository: CommentRepository
  ) {}
  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.userRepository.findByPhoneNumber(phoneNumber);
  }

  // 본인 유저 정보 조회
  async getMyInfo(user: User) {
    Logger.log(user);
    const myInfo = await this.userRepository.getMyInfo(user);
    if (!myInfo) {
      throw new UnauthorizedException(
        AuthErrorDefine['Auth-1003'],
        '디비에서 유저 조회시에 발생하는 오류'
      );
    }
    return plainToInstance(UserProfileDto, myInfo);
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findUserById(id);
  }

  // 유저 정보 조회(관리자용) 전체 정보 조회
  async getAllUserInfo(
    userFindDto: UserFindDto,
    pageOptionsDto: PageOptionsDto
  ) {
    const pageDto = await this.userRepository.getAllUserInfo(
      userFindDto,
      pageOptionsDto
    );
    const pageMetaData = pageDto.meta;
    const users = pageDto.data;
    const ret_users = users.map(function (user) {
      const userProfile = {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        createAt: user.createdAt,
        ticketNum: user.ticket?.length
      };
      return userProfile;
    });
    const entities = plainToInstance(ResponseUserTicketNumDto, ret_users);

    return new PageDto(entities, pageMetaData);
  }

  // 입금자명 수정
  async changeName(user: User, requestUserNameDto: RequestUserNameDto) {
    return await this.userRepository.changeName(user.id, requestUserNameDto);
  }

  // 응원 댓글 생성
  async makeComment(user: User, requestCommentDto: RequestCommentDto) {
    return await this.commentRepository.makeComment(user, requestCommentDto);
  }

  // 모든 댓글 조회
  async getAllComment(userId: number, scrollOptionsDto: ScrollOptionsDto) {
    const responseScrollCommentDto = await this.commentRepository.getAllComment(
      userId,
      scrollOptionsDto
    );
    const comments = responseScrollCommentDto.list;
    const ret_comments = comments.map(function (comment) {
      const responseCommentDto = {
        ...comment,
        iUserId: userId
      };
      return responseCommentDto;
    });
    const final_comments = plainToInstance(ResponseCommentDto, ret_comments);
    return new ResponseScrollCommentsDto(
      final_comments,
      responseScrollCommentDto.meta
    );
  }

  // 응원 댓글 갯수 조회
  async getCommentNum() {
    return await this.commentRepository.getCommentNum();
  }

  // 댓글 랜덤 조회
  async getRandomComment(requestRandomCommentDto: RequestRandomCommentDto) {
    return await this.commentRepository.getRandomComment(
      requestRandomCommentDto
    );
  }

  // 댓글 랜덤 조회(유저 정보 포함)
  async getRandomCommentUser(requestRandomCommentDto: RequestRandomCommentDto) {
    return await this.commentRepository.getRandomCommentUser(
      requestRandomCommentDto
    );
  }

  // 댓글 삭제
  async deleteComment(id: number) {
    return await this.commentRepository.deleteComment(id);
  }
}
