import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    console.log('phoneNumber', phoneNumber);
    let users;
    try {
      users = await this.userRepository.findOne({
        where: {
          phoneNumber: phoneNumber
        }
      });
    } catch (error) {
      console.log(error);
    }

    return users;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async saveUser(user: User) {
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: id
      }
    });
  }
}
