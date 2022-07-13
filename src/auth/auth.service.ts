import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { throwIfEmpty } from 'rxjs';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RedisService } from 'src/redis/redis.service';
import * as jwt from 'jsonwebtoken';
import { RequestPhoneNumberDto } from './dtos/phoneNumber.request.dto';
import { generateRandomCode } from 'src/common/funcs/random-code.func';
import { UsersService } from 'src/users/users.service';
import { ResponseRequestValidationDto } from './dtos/RequestValidation.response.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private redisSerivce: RedisService,
    private configService: ConfigService
  ) {}

  // async getAllUsers(): Promise<User[]> {
  //   // auto 시리얼 라이징
  //   const user = await this.userService.findAll();
  //   await this.redisSerivce.setWithTTLValidationNumber('asdfasdf', '0000', 30);
  //   return user;
  // }

  // async saveUser(): Promise<User> {
  //   const user = new User();
  //   user.phoneNumber = '010';
  //   user.name = '찬지니';
  //   console.log(await this.redisSerivce.getByKeyValidationNumber('asdfasdf'));

  //   return await this.userService.saveUser(user);
  // }

  async requestPhoneValidationNumber(
    requestPhoneNumberDto: RequestPhoneNumberDto
  ): Promise<ResponseValidationNumberDto> {
    //TODO : 전화번호 인증번호 발송 로직 추가 , 이찬진 2022.07.14

    //find user if already signUp
    const searchUser = await this.userService.findUserByPhoneNumber(
      requestPhoneNumberDto.phoneNumber
    );
    let checkSingUpState = false;
    if (searchUser) checkSingUpState = true;
    // generate randomNumber
    const generatedRandomNumber = generateRandomCode(4);
    // insert to redis
    await this.redisSerivce.setWithTTLValidationNumber(
      requestPhoneNumberDto.phoneNumber,
      generatedRandomNumber,
      180
    );

    return {
      alreadySingUp: checkSingUpState,
      validationNumber: generatedRandomNumber,
      phoneNumber: requestPhoneNumberDto.phoneNumber
    };
  }

  async validationPhoneNumber(
    requestPhoneNumberDto: RequestPhoneNumberDto
  ): Promise<ResponseRequestValidationDto> {
    //TODO : 전화번호 인증번호 발송 로직 추가 , 이찬진 2022.07.14

    //find user if already signUp
    const searchUser = await this.userService.findUserByPhoneNumber(
      requestPhoneNumberDto.phoneNumber
    );
    let checkSingUpState = false;
    if (searchUser) checkSingUpState = true;
    // generate randomNumber
    const generatedRandomNumber = generateRandomCode(4);
    // insert to redis
    await this.redisSerivce.setWithTTLValidationNumber(
      requestPhoneNumberDto.phoneNumber,
      generatedRandomNumber,
      180
    );

    return {
      alreadySingUp: checkSingUpState,
      validationNumber: generatedRandomNumber,
      phoneNumber: requestPhoneNumberDto.phoneNumber
    };
  }
}
