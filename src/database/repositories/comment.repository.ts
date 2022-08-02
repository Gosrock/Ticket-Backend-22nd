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
import { RequestRandomCommentDto } from 'src/users/dtos/RandomComment.request.dto';
import { ResponseRandomCommentDto } from 'src/users/dtos/RandomComment.response.dto';

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
      user: ret_user
    });

    await this.commentRepository.save(comment);

    const ret_comment = {
      ...comment,
      iUserId: ret_user.id
    };
    return plainToInstance(ResponseCommentDto, ret_comment);
  }

  // 응원 댓글 조회
  async getAllComment(userId: number, scrollOptionsDto: ScrollOptionsDto) {
    const { lastId } = scrollOptionsDto;
    const queryBuilder = this.commentRepository.createQueryBuilder('comment');
    // 한 번에 조회하는 댓글 수
    const take = 20;
    queryBuilder
      .leftJoinAndSelect('comment.user', 'user')
      .orderBy('comment.createdAt', 'DESC')
      .limit(take);

    if (lastId) {
      queryBuilder.where('comment.id < :lastId', { lastId: lastId });
    }

    const { entities } = await queryBuilder.getRawAndEntities();
    // ScrollMetaDto의 인자 값 : checkLastId, lastPage
    let checkLastId: null | number;
    let lastPage = false;
    // lastId값 초기화
    if (entities.length) {
      checkLastId = entities[entities.length - 1].id;
    } else {
      checkLastId = null;
    }
    // 마지막 페이지인지 확인
    if (entities.length < take) {
      lastPage = true;
    } else {
      lastPage = false;
    }

    const scrollMetaDto = new ScrollMetaDto(checkLastId, lastPage);

    return new ResponseScrollCommentDto(entities, scrollMetaDto);
  }

  // 댓글 랜덤 조회
  async getRandomComment(requestRandomCommentDto: RequestRandomCommentDto) {
    const { take } = requestRandomCommentDto;
    const queryBuilder = this.commentRepository.createQueryBuilder('comment');

    queryBuilder
      .orderBy('RANDOM()')
      .limit(take);

    
    const { entities } = await queryBuilder.getRawAndEntities();
    
    return plainToInstance(ResponseRandomCommentDto, entities);
  }

  // 댓글 삭제
  async deleteComment(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id: id } });
    const result = await this.commentRepository.delete(id);

    // 해당 아이디가 존재하는지 확인 후 없으면 오류 메시지 출력
    if (result.affected === 0) {
      throw new NotFoundException(`해당 id ${id}를 찾을 수 없습니다.`);
    }
    return plainToInstance(CommentDto, comment);
  }
}
