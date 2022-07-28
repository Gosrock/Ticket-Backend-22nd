import { Injectable, Logger } from '@nestjs/common';
import { Role } from 'src/common/consts/enum';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RequestUserNameDto } from './dtos/UserName.request.dto';
import { CommentRepository } from 'src/database/repositories/comment.repository';
import { RequestCommentDto } from './dtos/Comment.request.dto';

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
    return await this.userRepository.getMyInfo(user);
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findUserById(id);
  }

  //유저 롤 변경하는 테스트용 함수입니다
  async changeRole(userId: number, role: Role): Promise<User | null> {
    return await this.userRepository.changeRole(userId, role);
  }
  //유저 롤 변경하는 테스트용 함수입니다

  
  // 유저 정보 조회(관리자용) 전체 정보 조회
  async getAllUserInfo() {
    return await this.userRepository.getAllUserInfo();
  }

  // 입금자명 수정
  async changeName(user: User, requestUserNameDto: RequestUserNameDto) {
    return await this.userRepository.changeName(user.id, requestUserNameDto);
  }

  // 응원 댓글 생성
  async makeComment(user: User, requestCommentDto: RequestCommentDto) {
    return await this.commentRepository.makeComment(user, requestCommentDto);
  }

}
