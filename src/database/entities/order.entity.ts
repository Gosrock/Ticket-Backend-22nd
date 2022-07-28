import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { MaxLength } from 'class-validator';
import { OrderStatus, OrderDate } from '../../common/consts/enum';
import { UserProfileDto } from '../../common/dtos/user-profile.dto';
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
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

@Entity()
export class Order {
  @ApiProperty({
    description: '주문의 고유 식별번호입니다.',
    type: Number
  })
  @Expose()
  @Transform(({ value }) => value + 10000, { toPlainOnly: true })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: '공연일자 입니다. (BOTH/YB/OB)',
    enum: OrderDate
  })
  @Expose()
  @Column({
    type: 'enum',
    enum: OrderDate
  })
  public selection: OrderDate;

  @ApiProperty({
    description: '티켓의 개수',
    type: Number
  })
  @Expose()
  @Column()
  public ticketCount: number;

  @ApiProperty({
    description: '주문의 상태 (확인대기/입금확인/기한만료)',
    enum: OrderStatus
  })
  @MaxLength(10)
  @Expose()
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.WAIT
  })
  public status: OrderStatus;

  @ApiProperty({
    description: '총 주문 가격',
    type: Number
  })
  @Expose()
  @Column()
  public price: number;

  @ApiProperty({
    description: '공짜 티켓 여부',
    type: Boolean
  })
  @Expose()
  @Column()
  public isFree: boolean;

  @ApiProperty({
    description: '주문을 진행한 유저의 외래키',
    type: () => UserProfileDto
  })
  @Type(() => UserProfileDto)
  @Expose()
  @ManyToOne(type => User, user => user.order, { eager: false })
  public user: User;

  @ApiProperty({
    description: '주문을 처리한 어드민에 대한 외래키입니다.',
    type: () => UserProfileDto,
    nullable: true
  })
  @Type(() => UserProfileDto)
  @Expose()
  @ManyToOne(type => User)
  public admin: User;

  @ApiProperty({
    description: '한개의 주문에 속한 티켓목록',
    type: () => [Ticket]
  })
  @Expose()
  @OneToMany(type => Ticket, ticket => ticket.user, { eager: true })
  public ticket: Ticket[];

  @ApiProperty({
    description: '주문 생성 일자',
    type: Date
  })
  @Expose()
  @CreateDateColumn()
  public createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  public updatedAt: Date;
}
