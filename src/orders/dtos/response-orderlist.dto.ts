import { PartialType, PickType } from "@nestjs/swagger";
import { Order } from "src/database/entities/order.entity";

export class ResponseOrderListDto extends PickType((Order), [
	'id',
	'selection',
	'ticketCount',
	'status',
	'price',
	'isFree',
	'createdAt',
	'updatedAt',
  ] as const) {
	  //생성자
	  constructor(order: Order) {
		  super();
		  this.id = order.id;
		  this.selection = order.selection;
		  this.ticketCount = order.ticketCount;
		  this.status = order.status;
		  this.price = order.price;
		  this.isFree = order.isFree;
		  this.createdAt = order.createdAt;
		  this.updatedAt = order.updatedAt;
	  }
  }