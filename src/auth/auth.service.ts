import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException
} from '@nestjs/common';
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
import { RequestValidateNumberDto } from './dtos/ValidateNumber.request.dto';
import { ResponseValidateNumberDto } from './dtos/ValidateNumber.response.dto';
import { AccessJwtPayload, RegisterJwtPayload } from './auth.interface';
import { JWTType } from 'src/common/consts/enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private redisSerivce: RedisService,
    private configService: ConfigService
  ) {}

  async requestPhoneValidationNumber(
    requestPhoneNumberDto: RequestPhoneNumberDto
  ): Promise<ResponseRequestValidationDto> {
    //TODO : 전화번호 인증번호 발송 로직 추가 , 이찬진 2022.07.14
    const userPhoneNumber = requestPhoneNumberDto.phoneNumber;
    //유저가 이미 회원가입했는지확인한다.
    const checkSingUpState = await this.checkUserAlreadySignUp(userPhoneNumber);
    // generate randomNumber
    const generatedRandomNumber = generateRandomCode(4);
    // insert to redis
    await this.redisSerivce.setWithTTLValidationNumber(
      userPhoneNumber,
      generatedRandomNumber,
      180
    );

    return {
      alreadySingUp: checkSingUpState,
      validationNumber: generatedRandomNumber,
      phoneNumber: userPhoneNumber
    };
  }

  async validationPhoneNumber(
    requestValidateNumberDto: RequestValidateNumberDto
  ): Promise<ResponseValidateNumberDto> {
    //TODO : 전화번호 인증번호 발송 로직 추가 , 이찬진 2022.07.14
    const userPhoneNumber = requestValidateNumberDto.phoneNumber;
    //유저가 이미 회원가입했는지확인한다.
    const checkSingUpState = await this.checkUserAlreadySignUp(userPhoneNumber);

    // 레디스에서 전화번호가지고 정보를 빼내온다.
    const savedValidationNumber =
      await this.redisSerivce.getByKeyValidationNumber(userPhoneNumber);

    // 인증이 유효하지 않다면
    if (!savedValidationNumber) {
      throw new BadRequestException('인증번호 기한만료');
    }
    if (savedValidationNumber !== requestValidateNumberDto.validationNumber) {
      throw new BadRequestException('잘못된 인증번호');
    }
    // if (
    //   !(
    //     savedValidationNumber &&
    //     savedValidationNumber === requestValidateNumberDto.validationNumber
    //   )
    // ) {
    //   throw new BadRequestException('잘못된 인증번호');
    // }

    // 회원가입을 한 유저가아니라면 회원가입용 토큰 발급
    if (!checkSingUpState) {
      return {
        alreadySingUp: checkSingUpState,
        registerToken: this.registerJwtSign({ phoneNumber: userPhoneNumber })
      };
    } else {
      return {
        alreadySingUp: checkSingUpState
      };
    }
  }

  async registerUser() {
    this.logger.log('asdfasdfasdfasdfadsf');
  }

  /**
   * 유저가 회원가입했는지 확인하는 함수
   * @param phoneNumber
   * @returns 회원가입했으면 참을 리턴한다.
   */
  async checkUserAlreadySignUp(phoneNumber: string): Promise<boolean> {
    const searchUser = await this.userService.findUserByPhoneNumber(
      phoneNumber
    );

    let checkSingUpState = false;
    if (searchUser) checkSingUpState = true;
    return checkSingUpState;
  }

  private registerJwtSign(payload: RegisterJwtPayload) {
    const secret = this.configService.get(JWTType.REGISTER);
    console.log(secret, JWTType.REGISTER);
    return jwt.sign(payload, secret, {
      expiresIn: '10m'
    });
  }

  private accessJwtSign(payload: AccessJwtPayload) {
    const secret = this.configService.get(JWTType.ACCESS);
    return jwt.sign(payload, secret, {
      expiresIn: '3d'
    });
  }

  verifyRegisterJWT(jwtString: string): RegisterJwtPayload {
    try {
      const secret = this.configService.get(JWTType.REGISTER);

      const payload = jwt.verify(jwtString, secret) as (
        | jwt.JwtPayload
        | string
      ) &
        RegisterJwtPayload;

      const { phoneNumber } = payload;

      return {
        phoneNumber
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  verifyAccessJWT(jwtString: string): AccessJwtPayload {
    try {
      const secret = this.configService.get(JWTType.ACCESS);

      const payload = jwt.verify(jwtString, secret) as (
        | jwt.JwtPayload
        | string
      ) &
        AccessJwtPayload;

      const { phoneNumber, id } = payload;

      return {
        id,
        phoneNumber
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
