import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { RequestOrderDto } from 'src/orders/dtos/request-order.dto';
import { Order } from 'src/database/entities/order.entity';
import { User } from 'src/database/entities/user.entity';
import { OrderRepository } from 'src/database/repositories/order.repository';
import {
  OrderDate,
  OrderStatus,
  PerformanceDate,
  TicketStatus
} from 'src/common/consts/enum';
import { TicketsService } from 'src/tickets/tickets.service';
import { DataSource } from 'typeorm';
import { getConnectedRepository } from 'src/common/funcs/getConnectedRepository';
import { TicketRepository } from 'src/database/repositories/ticket.repository';
import { Ticket } from 'src/database/entities/ticket.entity';
import e from 'express';
import { QueueService } from 'src/queue/queue.service';
import { ResponseOrderDto } from './dtos/response-order.dto';
import { returnValueToDto } from 'src/common/decorators/returnValueToDto.decorator';
import { ResponseOrderListDto } from './dtos/response-orderlist.dto';
import { plainToInstance } from 'class-transformer';
import { OrderFindDto } from './dtos/order-find.dto';
import { PageOptionsDto } from 'src/common/dtos/page/page-options.dto';
import { PageDto } from 'src/common/dtos/page/page.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { OrderReportDto } from './dtos/order-report.dto';
import { ReportDto } from './dtos/report.dto';
import { TicketReportDto } from './dtos/ticket-report.dto';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepository: OrderRepository,
    private ticketRepository: TicketRepository,
    private ticketService: TicketsService,
    private dataSource: DataSource,
    private queueService: QueueService
  ) {}

  // 가격 책정 함수 : 단지 가독성을 위해 함수로 뺌
  getTotalPrice(requestOrderDto: RequestOrderDto): number {
    const { selection, ticketCount } = requestOrderDto;
    const pricePerTicket = 3000; // 티켓 한 장 가격
    const discountForBoth = 1000; // 양일권에 대한 할인 가격

    let totalPrice = pricePerTicket * ticketCount;

    if (selection === OrderDate.BOTH) {
      // ticketCount = 양일권 개수
      totalPrice = totalPrice * 2 - discountForBoth * ticketCount;
    }
    return totalPrice;
  }

  /**
   * selection과 ticketCount를 요청받아서 가격 책정 후 주문을 생성하고,
   * 해당 주문에 포함되는 모든 티켓을 각각 생성한다.
   * @param requestOrderDto {selection, ticketCount}
   * @param user Request User
   * @returns ResponseOrderDto
   */
  async createOrder(
    requestOrderDto: RequestOrderDto,
    user: User
  ): Promise<ResponseOrderDto> {
    const { selection, ticketCount } = requestOrderDto;
    const totalPrice = this.getTotalPrice(requestOrderDto); // 가격 책정

    // 양일권일 경우 요청수량 * 2 해서 저장
    if (selection === OrderDate.BOTH) {
      requestOrderDto.ticketCount *= 2;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const connectedOrder = getConnectedRepository(
      OrderRepository,
      queryRunner,
      Order
    );
    const connectedTicket = getConnectedRepository(
      TicketRepository,
      queryRunner,
      Ticket
    );

    try {
      // 주문 생성
      const order = await connectedOrder.createOrder(
        requestOrderDto,
        user,
        totalPrice
      );

      // ticketList에 생성할 티켓을 모두 담은 후 한번에 비동기요청
      const ticketList: any[] = [];

      for (let i = 0; i < ticketCount; i++) {
        if (selection === OrderDate.BOTH || selection === OrderDate.YB) {
          const createTicketDto = {
            date: PerformanceDate.YB,
            order,
            user
          };
          ticketList.push(createTicketDto);
        }
        if (selection === OrderDate.BOTH || selection === OrderDate.OB) {
          const createTicketDto = {
            date: PerformanceDate.OB,
            order,
            user
          };
          ticketList.push(createTicketDto);
        }
      }
      const ticketListForQ = await Promise.all(
        ticketList.map(dto => {
          return connectedTicket.createTicket(dto);
        })
      );
      await this.queueService.createNewOrderJob(order);
      await this.queueService.sendNaverSmsForOrderJob(order, ticketListForQ);
      await queryRunner.commitTransaction();

      //인스턴스 생성해서 넘겨주기
      return new ResponseOrderDto(order);
    } catch (e) {
      // 주문 생성 실패시 Error
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByUserId(userId: number): Promise<ResponseOrderListDto[]> {
    const orderList = await this.orderRepository.findAllByUserId(userId);
    return plainToInstance(ResponseOrderListDto, orderList);
  }

  async findAllWith(
    orderFindDto: OrderFindDto,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Order>> {
    return await this.orderRepository.findAllWith(orderFindDto, pageOptionsDto);
  }

  /**
   *
   * @param updateOrderStatusDto 변경할 주문 Id, 변경할 상태
   * @param admin 변경하는 user(admin)
   * @returns 변경 후 order
   */
  // 주문 상태 업데이트 시 해당 주문에 속한 티켓 상태도 함께 자동으로 업데이트
  async updateOrderStatus(
    updateOrderStatusDto: UpdateOrderStatusDto,
    admin: User
  ): Promise<Order> {
    const { orderId, status } = updateOrderStatusDto;
    // orderId로 주문 찾기
    const order = await this.orderRepository.findById(orderId);
    order.status = status;
    order.admin = admin;

    // orderId로 티켓리스트 가져오기
    const ticketList = await this.ticketService.findAllByOrderId(orderId);
    let ticketStatus: TicketStatus;
    if (status === OrderStatus.DONE) {
      // 주문 입금확인 -> 티켓 입금확인
      ticketStatus = TicketStatus.ENTERWAIT;
    } else if (status === OrderStatus.EXPIRE) {
      // 주문 기한만료 -> 티켓 기한만료
      ticketStatus = TicketStatus.EXPIRE;
    } else {
      // 주문 확인대기 -> 티켓 확인대기
      ticketStatus = TicketStatus.ORDERWAIT;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const connectedOrder = getConnectedRepository(
      OrderRepository,
      queryRunner,
      Order
    );
    const connectedTicket = getConnectedRepository(
      TicketRepository,
      queryRunner,
      Ticket
    );

    try {
      // 주문 상태, 어드민 변경
      await connectedOrder.saveOrder(order);

      // 주문에 속한 모든 티켓의 상태, 어드민 변경
      ticketList.map(async ticket => {
        ticket.status = ticketStatus;
        ticket.admin = admin;
        await connectedTicket.saveTicket(ticket);
      });

      await queryRunner.commitTransaction();
      return order;
    } catch (e) {
      // 하나의 task라도 실패할 경우 모두 롤백
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async makeOrderFree(orderId: number): Promise<Order> {
    // orderId로 주문 찾기
    const order = await this.orderRepository.findById(orderId);
    order.isFree = true;
    await this.orderRepository.saveOrder(order);
    return order;
  }

  //전체 현황 조회
  async getReport(): Promise<ReportDto> {
    const report = {
      orderReport: await this.orderRepository.getOrderReport(),
      ticketReport: await this.ticketRepository.getTicketReport(),
      enterReport: await this.ticketRepository.getEnterReport(),
      income: await this.orderRepository.getIncome()
    };
    return report;
  }
}
