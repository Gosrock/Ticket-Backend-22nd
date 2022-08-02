import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PageOrder } from 'src/common/consts/enum';

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: PageOrder, default: PageOrder.ASC })
  @IsEnum(PageOrder)
  @IsOptional()
  @Expose()
  readonly order: PageOrder = PageOrder.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Expose()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @Expose()
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
