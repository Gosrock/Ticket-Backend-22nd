import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/common/consts/enum';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
    description: '유저 정보 입니다.',
    type: String
  })
  @Expose()
  @ManyToOne(() => User)
  public user: User;
}
