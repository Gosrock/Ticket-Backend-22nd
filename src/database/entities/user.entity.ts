import { Role } from 'src/common/consts/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public phoneNumber: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User
  })
  public role: Role;
}
