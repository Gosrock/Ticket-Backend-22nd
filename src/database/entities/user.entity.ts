import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from 'src/common/consts/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({
    description: '유저의 고유 아이디입니다.',
    type: Number
  })
  @Expose()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: '유저의 입금자명입니다.',
    type: String
  })
  @Expose()
  @Column()
  public name: string;

  @ApiProperty({
    description: '유저의 휴대전화번호 입니다.',
    type: String
  })
  @Expose()
  @Column()
  public phoneNumber: string;

  @ApiProperty({
    description: '유저의 권한입니다.',
    enum: Role
  })
  @Expose()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  public role: Role;
}
