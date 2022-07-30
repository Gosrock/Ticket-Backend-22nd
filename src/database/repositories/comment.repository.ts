import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/consts/enum';
import { QueryBuilder, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { RequestCommentDto } from 'src/users/dtos/Comment.request.dto';
import { ResponseCommentDto } from 'src/users/dtos/Comment.response.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>
  ) {}
  
  // 응원 댓글 생성
  async makeComment(user: User, requestCommentDto: RequestCommentDto) {
    const { content, nickName } = requestCommentDto;
    
    const comment = this.commentRepository.create({
      nickName,
      content,
      user
    })

    await this.commentRepository.save(comment);
    
    return comment;
  }

  // 응원 댓글 조회
  async getAllComment(userId: number) {
    const comments = await this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .orderBy('comment.createdAt', "ASC")
      .getMany()
    
    return comments;
  }

  // 댓글 삭제
  async deleteComment(id: number) {
    const result = await this.commentRepository.delete(id);

    // 해당 아이디가 존재하는지 확인 후 없으면 오류 메시지 출력
		if (result.affected === 0) {
			throw new NotFoundException(`해당 id ${id}를 찾을 수 없습니다.`);
		} 
  }
}