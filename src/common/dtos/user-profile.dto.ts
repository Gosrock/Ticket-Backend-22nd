import { PickType, PartialType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/database/entities/user.entity';

export class UserProfileDto extends PickType(PartialType(User), [
  'name',
  'phoneNumber',
  'role',
  'createdAt'
] as const) {
  static convertFrom(user: User): UserProfileDto {
    return plainToInstance(UserProfileDto, user, {
      excludeExtraneousValues: true
    });
  }
}
