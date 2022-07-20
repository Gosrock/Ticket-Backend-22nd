import { PickType, PartialType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/database/entities/user.entity';

export class UserProfileDto extends PickType(PartialType(User), [
  'name',
  'phoneNumber',
  'role',
  'createdAt'
] as const) {
  constructor(user: User) {
    super();
    this.name = user.name;
    this.phoneNumber = user.phoneNumber;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }

  static convertFrom(user: User): UserProfileDto {
    return plainToInstance(UserProfileDto, user, {
      excludeExtraneousValues: true
    });
  }
}
