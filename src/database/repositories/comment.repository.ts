import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/consts/enum';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { RequestCommentDto } from 'src/users/dtos/Comment.request.dto';

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

}