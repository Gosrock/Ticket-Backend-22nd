import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PerformanceDate, TicketStatus } from 'src/common/consts/enum';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { nanoid } from 'nanoid';

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
  @Column('varchar', { length: 14 })
  public uuid: string;

  @ApiProperty({
    description: '공연일자 입니다. (YB/OB)',
    enum: PerformanceDate
  })
  @Expose()
  @Column({
    type: 'enum',
    enum: PerformanceDate
  })
  public date: PerformanceDate;

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
  @ManyToOne(() => Order, order => order.user, { eager: false })
  public order: Order;

  @ApiProperty({
    description: '티켓을 처리한 어드민에 대한 외래키입니다.',
    type: () => User,
    nullable: true
  })
  @Expose()
  @ManyToOne(type => User)
  public admin: User | null;

  @ApiProperty({
    description: '주문한 유저에 대한 외래키입니다.',
    type: () => User
  })
  @Expose()
  @ManyToOne(type => User, user => user.ticket, { eager: false })
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

  @BeforeInsert()
  setUuid() {
    this.uuid = nanoid(14).toString();
  }
}
