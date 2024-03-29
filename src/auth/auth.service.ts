import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RedisService } from 'src/redis/redis.service';
import * as jwt from 'jsonwebtoken';
import { RequestPhoneNumberDto } from './dtos/phoneNumber.request.dto';
import { generateRandomCode } from 'src/common/funcs/random-code.func';
import { UsersService } from 'src/users/users.service';
import { ResponseRequestValidationDto } from './dtos/RequestValidation.response.dto';
import { RequestValidateNumberDto } from './dtos/ValidateNumber.request.dto';
import { BaseResponseValidateNumberDto } from './dtos/BaseValidateNumber.response.dto';
import { AccessJwtPayload, RegisterJwtPayload } from './auth.interface';
import { JWTType, Role } from 'src/common/consts/enum';
import { RequestRegisterUserDto } from './dtos/RegisterUser.request.dto';
import { DataSource } from 'typeorm';
import { getConnectedRepository } from 'src/common/funcs/getConnectedRepository';
import { ResponseRegisterUserDto } from './dtos/RegisterUser.response.dto';
import { RequestAdminSendValidationNumberDto } from './dtos/AdminSendValidationNumber.request.dto copy';
import { SlackService } from 'src/slack/slack.service';
import { ResponseAdminSendValidationNumberDto } from './dtos/AdminSendValidationNumber.response.dto';
import { RequestAdminLoginDto } from './dtos/AdminLogin.request.dto';
import { ResponseAdminLoginDto } from './dtos/AdminLogin.response.dto';
import { SmsService } from 'src/sms/sms.service';
import { MessageDto } from 'src/sms/dtos/message.dto';
import { SlackValidationNumberDMDto } from 'src/slack/dtos/SlackValidationNumberDM.dto';
import { returnValueToDto } from 'src/common/decorators/returnValueToDto.decorator';
import { AuthErrorDefine } from './Errors/AuthErrorDefine';
import { plainToInstance } from 'class-transformer';
import { LoginResponseDto } from './dtos/Login.response.dto';
import { FirstReigsterDto } from './dtos/FirstRegister.response.dto copy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userRepository: UserRepository,
    private dataSource: DataSource,
    private redisSerivce: RedisService,
    private configService: ConfigService,
    private slackService: SlackService,
    private smsService: SmsService
  ) {}

  @returnValueToDto(ResponseRequestValidationDto)
  async requestPhoneValidationNumber(
    requestPhoneNumberDto: RequestPhoneNumberDto
  ): Promise<ResponseRequestValidationDto> {
    //console.log(this.dataSource);
    ////console.log(test.adf.asdf);
    //TODO : 전화번호 인증번호 발송 로직 추가 , 이찬진 2022.07.14
    const userPhoneNumber = requestPhoneNumberDto.phoneNumber;
    //유저가 이미 회원가입했는지확인한다.
    const checkSingUpState = await this.checkUserAlreadySignUp(userPhoneNumber);
    // generate randomNumber

    const generatedRandomNumber = generateRandomCode(4);
    const message = new MessageDto(
      userPhoneNumber,
      `고스락 티켓예매\n인증번호 [${generatedRandomNumber}]`
    );

    try {
      await this.smsService.sendMessages([message]);
    } catch (error) {
      throw new InternalServerErrorException(
        AuthErrorDefine['Auth-5000'],
        '네이버 문자발송이 실패할시 보내는 오류'
      );
    }

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

  // @returnValueToDto(BaseResponseValidateNumberDto)
  async validationPhoneNumber(
    requestValidateNumberDto: RequestValidateNumberDto
  ) {
    //TODO : 전화번호 인증번호 발송 로직 추가 , 이찬진 2022.07.14
    const userPhoneNumber = requestValidateNumberDto.phoneNumber;
    //유저가 이미 회원가입했는지확인한다.
    const checkSingUpState = await this.checkUserAlreadySignUp(userPhoneNumber);

    // 레디스에서 전화번호가지고 정보를 빼내온다.
    const savedValidationNumber =
      await this.redisSerivce.getByKeyValidationNumber(userPhoneNumber);

    // 인증이 유효하지 않다면
    if (!savedValidationNumber) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0000'],
        '인증번호 기한이 만료되었을때 보내는 오류'
      );
    }
    if (savedValidationNumber !== requestValidateNumberDto.validationNumber) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0001'],
        '인증 번호가 일치하지 않았을때 보내는 오류'
      );
    }
    // 회원가입을 한 유저가아니라면 회원가입용 토큰 발급
    if (!checkSingUpState) {
      return plainToInstance(FirstReigsterDto, {
        alreadySingUp: checkSingUpState,
        registerToken: this.registerJwtSign({ phoneNumber: userPhoneNumber })
      });
    } else {
      const user = await this.userRepository.findByPhoneNumber(userPhoneNumber);
      //console.log(user);
      if (!user) {
        throw new BadRequestException('잘못된 접근', '비정상 접근입니다.');
      }
      const userProfile = {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role
      };
      const accessToken = this.accessJwtSign(userProfile);
      //console.log(accessToken);

      return plainToInstance(LoginResponseDto, {
        accessToken,
        alreadySingUp: checkSingUpState,
        user: userProfile
      });
    }
  }

  @returnValueToDto(ResponseRegisterUserDto)
  async registerUser(
    registerUser: RegisterJwtPayload,
    requestRegisterUserDto: RequestRegisterUserDto
  ): Promise<ResponseRegisterUserDto> {
    const checkUserAlreadySignUp = await this.checkUserAlreadySignUp(
      registerUser.phoneNumber
    );
    if (checkUserAlreadySignUp) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0002'],
        '중복 회원가입 요청할때 발생하는 오류'
      );
    }
    // 트랜잭션 예시
    // typeOrm 으로 부터 주입받은 dataSource(커넥션 풀) 로부터 쿼리러너를 받고
    const queryRunner = this.dataSource.createQueryRunner();
    // 커넥트로 커넥션 땡겨옴
    await queryRunner.connect();

    await queryRunner.startTransaction();
    // 땡겨온 커넥션으로 유저 레포지토리를 받아옴 하지만 우리는 repository 패턴을 쓰므로 ( 따로 뺌으로 )
    // 의존성 주입을 해 커넥션이 동일한 레포지토리를 가져옴
    const connectedUserRepository = getConnectedRepository(
      UserRepository,
      queryRunner,
      User
    );

    try {
      const user = new User();

      user.name = requestRegisterUserDto.name;
      user.phoneNumber = registerUser.phoneNumber;

      const signUser = await connectedUserRepository.saveUser(user);

      const accessToken = this.accessJwtSign({
        id: signUser.id,
        phoneNumber: signUser.phoneNumber,
        name: signUser.name,
        role: signUser.role
      });

      await queryRunner.commitTransaction();
      return {
        accessToken,
        user: signUser
      };
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();

      throw e;
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }
  }

  @returnValueToDto(ResponseAdminSendValidationNumberDto)
  async slackSendValidationNumber(
    requestAdminSendValidationNumberDto: RequestAdminSendValidationNumberDto
  ): Promise<ResponseAdminSendValidationNumberDto> {
    //유저가 이미 회원가입했는지확인한다.
    const searchUser = await this.userRepository.findByPhoneNumber(
      requestAdminSendValidationNumberDto.phoneNumber
    );

    if (!searchUser) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0003'],
        '가입한 유저나 어드민 유저가 아닐때 발생하는 오류'
      );
    }
    if (searchUser.role !== Role.Admin) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0003'],
        '가입한 유저나 어드민 유저가 아닐때 발생하는 오류'
      );
    }
    // 레디스에서 전화번호가지고 정보를 빼내온다.

    const slaceUserId = await this.slackService.findSlackUserIdByEmail(
      requestAdminSendValidationNumberDto.slackEmail
    );
    //console.log(slaceUserId);
    if (!slaceUserId) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0004'],
        '슬랙 이메일이 고스락 채널 정보에 없을때 발생하는 오류'
      );
    }

    const randomCode = generateRandomCode(4);
    await this.redisSerivce.setWithTTLValidationNumber(
      requestAdminSendValidationNumberDto.slackEmail,
      randomCode,
      180
    );
    await this.slackService.sendDMwithValidationNumber(
      new SlackValidationNumberDMDto(slaceUserId, randomCode)
    );

    return { validationNumber: randomCode };
  }

  @returnValueToDto(ResponseAdminLoginDto)
  async slackLoginUser(
    requestAdminLoginDto: RequestAdminLoginDto
  ): Promise<ResponseAdminLoginDto> {
    const findValidationNumberFromRedis =
      await this.redisSerivce.getByKeyValidationNumber(
        requestAdminLoginDto.slackEmail
      );
    if (!findValidationNumberFromRedis) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0000'],
        '3분짜리 인증번호 기한이 지났을 때 발생하는 오류입니당.'
      );
    }

    if (
      findValidationNumberFromRedis !== requestAdminLoginDto.validationNumber
    ) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0001'],
        '인증번호 검증이 알맞지 않을때 발생하는 오류입니다.'
      );
    }

    const searchUser = await this.userRepository.findByPhoneNumber(
      requestAdminLoginDto.phoneNumber
    );

    if (!searchUser) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0005'],
        '가입한 유저나 어드민 유저가 아닙니다.'
      );
    }
    if (searchUser.role !== Role.Admin) {
      throw new BadRequestException(
        AuthErrorDefine['Auth-0005'],
        '가입한 유저나 어드민 유저가 아닙니다.'
      );
    }
    const accessToken = this.accessJwtSign({
      id: searchUser.id,
      phoneNumber: searchUser.phoneNumber,
      name: searchUser.name,
      role: searchUser.role
    });
    return {
      user: searchUser,
      accessToken
    };
  }

  /**
   * 유저가 회원가입했는지 확인하는 함수
   * @param phoneNumber
   * @returns 회원가입했으면 참을 리턴한다.
   */
  async checkUserAlreadySignUp(phoneNumber: string): Promise<boolean> {
    const searchUser = await this.userRepository.findByPhoneNumber(phoneNumber);
    //console.log('asdcfasdfasdfdsaf');

    let checkSingUpState = false;
    if (searchUser) checkSingUpState = true;
    return checkSingUpState;
  }

  private registerJwtSign(payload: RegisterJwtPayload) {
    const secret = this.configService.get(JWTType.REGISTER);
    //console.log(secret, JWTType.REGISTER);
    return jwt.sign(payload, secret, {
      expiresIn: 60 * 10
    });
  }

  private accessJwtSign(payload: AccessJwtPayload) {
    const secret = this.configService.get(JWTType.ACCESS);
    try {
      return jwt.sign(payload, secret, {
        expiresIn: 60 * 60 * 24 * 14
      });
    } catch (error) {
      Logger.log(error);

      throw new InternalServerErrorException(
        '어세스토큰 생성오류. 관리자한테 연락주세요'
      );
    }
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
      if (e.name === 'TokenExpiredError')
        throw new UnauthorizedException(
          AuthErrorDefine['Auth-1002'],
          '토큰 기한만료시 발생되는 에러'
        );
      throw new UnauthorizedException(
        AuthErrorDefine['Auth-1001'],
        '잘못된 토큰일시 발생되는 에러'
      );
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
      const { phoneNumber, id, name, role } = payload;

      return {
        id,
        phoneNumber,
        name,
        role
      };
    } catch (e) {
      if (e.name === 'TokenExpiredError')
        throw new UnauthorizedException(
          AuthErrorDefine['Auth-1002'],
          '토큰 기한만료시 발생되는 에러'
        );
      throw new UnauthorizedException(
        AuthErrorDefine['Auth-1001'],
        '잘못된 토큰일시 발생되는 에러'
      );
    }
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findUserById(id);
  }

  async checkUserExist(id: number): Promise<boolean> {
    return await this.userRepository.checkUserExist(id);
  }
}
