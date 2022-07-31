import { PickType, PartialType, ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { User } from 'src/database/entities/user.entity';
import { Role } from '../consts/enum';

export class UserProfileDto {
  @ApiProperty({
    description: '유저의 고유 아이디입니다.',
    type: Number
  })
  @Expose()
  public id: number;

  @ApiProperty({
    description: '유저의 입금자명입니다.',
    type: String
  })
  @Expose()
  public name: string;

  @ApiProperty({
    description: '유저의 휴대전화번호 입니다.',
    type: String
  })
  @Expose()
  public phoneNumber: string;

  @ApiProperty({
    description: '유저의 권한입니다.',
    enum: Role
  })
  @Expose()
  public role: Role;
}
