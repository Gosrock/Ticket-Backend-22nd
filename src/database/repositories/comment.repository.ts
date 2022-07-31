import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/consts/enum';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { RequestCommentDto } from 'src/users/dtos/Comment.request.dto';
import { ScrollOptionsDto } from 'src/users/dtos/Scroll/ScrollOptions.dto';
import { ScrollMetaDto } from 'src/users/dtos/Scroll/ScrollMeta.dto';
import { ResponseScrollCommentDto } from 'src/users/dtos/Scroll/ScrollComment.response.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseCommentDto } from 'src/users/dtos/Comment.response.dto';
import { CommentDto } from 'src/users/dtos/Comment.dto';
import { UserProfileDto } from 'src/common/dtos/user-profile.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>
  ) {}
  
  // 응원 댓글 생성
  async makeComment(user: User, requestCommentDto: RequestCommentDto) {
    const { content, nickName } = requestCommentDto;
    const ret_user = plainToInstance(UserProfileDto, user);
    const comment = this.commentRepository.create({
      nickName,
      content,
      user: ret_user,
    })

    await this.commentRepository.save(comment);

    const ret_comment = {
      ...comment,
      iUserId: ret_user.id
    }
    return plainToInstance(ResponseCommentDto, ret_comment);
  }

  // 응원 댓글 조회
  async getAllComment(userId: number, scrollOptionsDto: ScrollOptionsDto) {
    const queryBuilder = await this.commentRepository.createQueryBuilder('comment');
      
    queryBuilder
      .leftJoinAndSelect('comment.user', 'user')
      .orderBy('comment.createdAt', "DESC")
      .skip(scrollOptionsDto.skip)
      .take(scrollOptionsDto.take);
    
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    console.log(entities);
    const lastId = entities[entities.length - 1].id;
    const scrollMetaDto = new ScrollMetaDto(scrollOptionsDto, itemCount, lastId);
    
    return new ResponseScrollCommentDto(entities, scrollMetaDto);
  }

  // 댓글 삭제
  async deleteComment(id: number) {
    const comment = await this.commentRepository.findOne({ where: {id: id}})
    const result = await this.commentRepository.delete(id);

    // 해당 아이디가 존재하는지 확인 후 없으면 오류 메시지 출력
		if (result.affected === 0) {
			throw new NotFoundException(`해당 id ${id}를 찾을 수 없습니다.`);
		}
    return plainToInstance(CommentDto, comment);
  }
}