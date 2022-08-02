import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { async } from 'rxjs';
import { OrderStatus, TicketStatus } from 'src/common/consts/enum';
import { PageMetaDto } from 'src/common/dtos/page/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { EnterReportDto } from 'src/orders/dtos/enter-report.dto';
import { OrderFindDto } from 'src/orders/dtos/order-find.dto';
import { OrderReportDto } from 'src/orders/dtos/order-report.dto';
import { RequestOrderDto } from 'src/orders/dtos/request-order.dto';
import { ResponseOrderListDto } from 'src/orders/dtos/response-orderlist.dto';
import { TicketReportDto } from 'src/orders/dtos/ticket-report.dto';
import { Like, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Ticket } from '../entities/ticket.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  /**
   * 주문을 생성한다
   * @param requestOrderDto {selection, ticketCount}
   * @param user Request User
   * @param totalPrice 총 입금할 금액
   * @returns 생성된 주문
   */
  async createOrder(
    requestOrderDto: RequestOrderDto,
    user: User,
    totalPrice: number
  ): Promise<Order> {
    const { selection, ticketCount } = requestOrderDto;
    const order = this.orderRepository.create({
      selection,
      ticketCount,
      price: totalPrice,
      user: user,
      isFree: false
    });
    await this.orderRepository.save(order);
    return order;
  }

  /**
   *
   * @param userId 해당 유저의 주문 목록을 가져온다
   * @returns Order배열
   */
  async findAllByUserId(userId: number): Promise<Order[]> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where({ user: userId })
      .getMany();
  }

  async findById(orderId: number): Promise<Order> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .where({ id: orderId })
      .getOne();

    if (!order) {
      throw new NotFoundException(`id ${orderId}의 주문을 찾을 수 없습니다`);
    }
    return order;
  }

  /**
   *
   * @param orderFindDto 조회 옵션 (주문상태, 주문공연날짜, 공짜여부, 이름검색)
   * @param pageOptionsDto  페이지 조회 옵션
   * @returns 주문 목록 조회 결과와 페이지 정보
   */
  async findAllWith(
    orderFindDto: OrderFindDto,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Order>> {
    const { status, selection, searchName, isFree } = orderFindDto;
    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    const name = searchName;

    if (status) {
      queryBuilder.andWhere({ status });
    }
    if (selection) {
      queryBuilder.andWhere({ selection });
    }
    if (name) {
      queryBuilder.andWhere('user.name like :name', {
        name: `%${searchName}%`
      });
    }
    if (isFree) {
      queryBuilder.andWhere({ isFree });
    }

    queryBuilder
      .orderBy('order.id', pageOptionsDto.order)
      .leftJoin('order.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.phoneNumber', 'user.role'])
      .leftJoin('order.admin', 'admin')
      .addSelect(['admin.id', 'admin.name', 'admin.phoneNumber', 'admin.role'])
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async saveOrder(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }

  /**
   *
   * @returns 주문 입금 관련 현황 (세가지 상태 현황)
   */
  async getOrderReport(): Promise<OrderReportDto> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    queryBuilder.select('order.id');

    const orderReportDto = {
      totalOrder: await queryBuilder.getCount(),
      waitOrder: await queryBuilder
        .where({ status: OrderStatus.WAIT })
        .getCount(),
      doneOrder: await queryBuilder
        .where({ status: OrderStatus.DONE })
        .getCount(),
      expireOrder: await queryBuilder
        .where({ status: OrderStatus.EXPIRE })
        .getCount()
    };
    return orderReportDto;
  }

  /**
   *
   * @returns 입금확인 된 판매대금
   */
  async getIncome(): Promise<number> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    queryBuilder
      .select('SUM(order.price)', 'sum')
      .where({ status: OrderStatus.DONE })
      .andWhere({ isFree: false });

    let income = await queryBuilder.getRawOne();
    if (income.sum == null) {
      income.sum = 0;
    }
    return parseInt(income.sum);
  }

  async getFreeTicketCount(): Promise<number> {
    const queryBuilderForFree =
      this.orderRepository.createQueryBuilder('order');

    let freeOrder = await queryBuilderForFree
      .select('SUM(order.ticketCount)', 'freeTicketCount')
      .where({ isFree: 'true' })
      .getRawOne();
    if (freeOrder.freeTicketCount == null) {
      freeOrder.freeTicketCount = 0;
    }
    return parseInt(freeOrder.freeTicketCount);
  }
}
