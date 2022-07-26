import { ApiProperty } from "@nestjs/swagger";
import { OrderDate, OrderStatus } from "src/common/consts/enum";
import { Expose, Transform, Type } from 'class-transformer';
import { UserProfileDto } from "src/common/dtos/user-profile.dto";
import { User } from "src/database/entities/user.entity";

export class ResponseOrderDto {
	@ApiProperty({
		description: '주문 고유 식별번호',
		type: Number
	  })
	  @Expose()
	  @Transform(({ value }) => value + 10000, { toPlainOnly: true })
	  public id: number;
	
	  @ApiProperty({
		description: '공연일자 (BOTH/YB/OB)',
		enum: OrderDate
	  })
	  @Expose()
	  public selection: OrderDate;
	
	  @ApiProperty({
		description: '티켓의 개수',
		type: Number
	  })
	  @Expose()
	  public ticketCount: number;
	
	  @ApiProperty({
		description: '주문의 상태 (확인대기/입금확인/기한만료)',
		enum: OrderStatus
	  })
	  @Expose()
	  public status: OrderStatus;
	
	  @ApiProperty({
		description: '총 주문 가격',
		type: Number
	  })
	  @Expose()
	  public price: number;
	
	  @ApiProperty({
		description: '공짜 티켓 여부',
		type: Boolean
	  })
	  @Expose()
	  public isFree: boolean;
	
	  @ApiProperty({
		description: '주문을 진행한 유저의 외래키',
		type: () => UserProfileDto
	  })
	  @Type(() => UserProfileDto)
	  @Expose()
	  public user: User;
	
	  @ApiProperty({
		description: '주문 생성 일자',
		type: Date
	  })
	  @Expose()
	  public createdAt: Date;
	
	  @ApiProperty({
		description: '주문 업데이트 일자',
		type: Date
	  })
	  @Expose()
	  public updatedAt: Date;
}