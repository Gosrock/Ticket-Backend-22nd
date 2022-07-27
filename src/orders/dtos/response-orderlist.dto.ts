import { PickType } from "@nestjs/swagger";
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
  ] as const) {}