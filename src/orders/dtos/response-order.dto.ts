import { PickType } from "@nestjs/swagger";
import { Order } from "src/database/entities/order.entity";

export class ResponseOrderDto extends PickType((Order), [
	'id',
	'selection',
	'ticketCount',
	'status',
	'price',
	'isFree',
	'user',
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
		  this.user = order.user;
		  this.createdAt = order.createdAt;
		  this.updatedAt = order.updatedAt;
	  }
  }