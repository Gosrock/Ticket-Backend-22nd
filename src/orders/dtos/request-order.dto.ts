import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsIn, IsNumber } from "class-validator";
import { OrderDate } from "../../common/consts/enum";

export class RequestOrderDto {
	@ApiProperty({ description: '공연일자', enum: OrderDate })
	@IsEnum(OrderDate)
	@Expose()
	selection: OrderDate;

	@ApiProperty({ description: '티켓수량', type: Number })
	@IsNumber()
	@IsIn([1,2,3])
	@Expose()
	ticketCount: number;
}