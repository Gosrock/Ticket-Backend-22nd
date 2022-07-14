import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { MaxLength } from 'class-validator';
import { OrderStatus, OrderDate } from 'src/common/consts/enum';
import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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
    type: Number,
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
    default: OrderStatus.WAIT,
  })
  public status: OrderStatus;  

  @ApiProperty({
    description: '총 주문 가격',
    type: Number,
  })
  @Expose()
  @Column()
  public price: number;

  @ApiProperty({
    description: '공짜 티켓 여부',
    type: Boolean,
  })
  @Expose()
  @Column()
  public isFree: boolean;

  @ApiProperty({
    description: '주문을 진행한 유저의 외래키',
    type: User
  })
  @Expose()
  @OneToMany((type) => User, (user) => user.id, { eager: false })
  @Column()
  public user: User;

  @ApiProperty({
    description: '한개의 주문에 속한 티켓목록',
    type: Ticket
  })
  @Expose()
  @ManyToOne((type) => Ticket, (ticket) => ticket.id, { eager: false })
  @Column()
  public ticket: Ticket[];

  @ApiProperty({
    description: '주문 생성 일자',
    type: Date,
  })
  @Expose()
  @CreateDateColumn()
  public createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  public updatedAt: Date;  
}
