import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/common/consts/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Comment } from './comment.entity';
import { Order } from './order.entity';
import { Ticket } from './ticket.entity';

@Entity()
export class User {
  @ApiProperty({
    description: '유저의 고유 아이디입니다.',
    type: Number
  })
  @Expose()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: '유저의 입금자명입니다.',
    type: String
  })
  @Expose()
  @Column()
  public name: string;

  @ApiProperty({
    description: '유저의 휴대전화번호 입니다.',
    type: String
  })
  @Expose()
  @Column('varchar', { length: 20 })
  public phoneNumber: string;

  @ApiProperty({
    description: '유저의 권한입니다.',
    enum: Role
  })
  @Expose()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  public role: Role;

  @OneToMany(type => Comment, comment => comment.user, { eager: true })
  public comments: Comment[];

  @ApiProperty({
    description: '유저의 주문목록',
    type: () => [Order]
  })
  @Expose()
  @OneToMany(type => Order, order => order.user, { eager: true })
  public order: Order[];

  @ApiProperty({
    description: '유저의 티켓목록',
    type: () => [Ticket]
  })
  @Expose()
  @OneToMany(type => Ticket, ticket => ticket.user, { eager: true })
  public ticket: Ticket[];

  @ApiProperty({
    description: '유저 생성 일자',
    type: Date
  })
  @Expose()
  @CreateDateColumn()
  public createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  public updatedAt: Date;
}
