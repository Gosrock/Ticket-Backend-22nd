import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MaxLength } from 'class-validator';
import { PerformanceDate, TicketStatus } from 'src/common/consts/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity()
export class Ticket {
  @ApiProperty({
    description: '티켓 고유 식별번호입니다.',
    type: Number
  })
  @Expose()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: '티켓의 고유 아이디(uuid) 입니다.',
    type: String
  })
  @Expose()
  @Column()
  @Generated('uuid')
  public uuid: string;

  @ApiProperty({
    description: '공연일자 입니다. (2022/09/01 또는 2022/09/02)',
    enum: PerformanceDate
  })
  @Expose()
  @Column({
    type: 'enum',
    enum: PerformanceDate
  })
  public date: string;

  @ApiProperty({
    description: '티켓의 상태입니다. (입장대기/입장완료)',
    enum: TicketStatus
  })
  @Expose()
  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.WAIT
  })
  public status: TicketStatus;

  @ApiProperty({
    description: '주문번호에 대한 외래키입니다.',
    type: () => Order
  })
  @Expose()
  @ManyToOne(() => Order, order => order.id, { eager: false })
  public order: Order;

  @ApiProperty({
    description: '주문을 처리한 어드민에 대한 외래키입니다.',
    type: () => User
  })
  @Expose()
  @ManyToOne(type => User, user => user.id, { eager: false })
  public admin: User;

  @ApiProperty({
    description: '주문한 유저에 대한 외래키입니다.',
    type: () => User
  })
  @Expose()
  @ManyToOne(type => User, user => user.id, { eager: false })
  public user: User;

  @ApiProperty({
    description: '티켓 생성 일자',
    type: Date
  })
  @Expose()
  @CreateDateColumn()
  public createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  public updatedAt: Date;
}
