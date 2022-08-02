import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserFindDto {
  @ApiProperty({
    description: '입금자명', 
    type: String, 
    required: false 
  })
  @Expose()
  readonly searchName: string;

  @ApiProperty({ 
    description: '전화번호', 
    type: String, 
    required: false 
  })
  @Expose()
  readonly phoneNumber: string;
}