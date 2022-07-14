import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Role } from 'src/common/consts/enum';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Comment {
  @ApiProperty({
    description: '댓글의 고유 아이디 입니다.',
    type: Number
  })
  @Expose()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: '댓글 내용',
    type: String
  })
  @Expose()
  @Column('text')
  public content: string;

  @ApiProperty({
    description: '익명 닉네임',
    type: String
  })
  @Expose()
  @Column('varchar', { length: 15 })
  public nickName: string;

  @ApiProperty({
    description: '유저 정보 입니다.',
    type: String
  })
  @Expose()
  @ManyToOne(() => User, { eager: false })
  public user: User;

  @ApiProperty({
    description: '응원 코멘트 생성 일자',
    type: Date
  })
  @Expose()
  @CreateDateColumn()
  public createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  public updatedAt: Date;
}
