import { UserRepository } from './../../repositories/user.repository';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Payload } from '../jwt-payload';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserIdDto } from 'src/common/dtos/UserId.dto';
import { STATUS_TYPE } from 'src/common/consts/enum';
import { UserService } from 'src/apis/users/user.service';
import { AuthService } from '../auth.service';
import { toKRTimeZone } from 'src/common/funcs/toKRTimezone';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private config: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: Payload) {
    // console.log(payload);
    const user = await this.userRepository.findOneByUserId(
      new UserIdDto(payload._id)
    );

    if (user) {
      if (user.status === STATUS_TYPE.FORBIDDEN) {
        const findIfBanEnd = await this.authService.findOneForbiddenByUserId(
          new UserIdDto(payload._id)
        );

        if (!findIfBanEnd) {
          await this.authService.unBanUser(new UserIdDto(payload._id));
        } else {
          const createdAt = findIfBanEnd.createdAt;
          const threeDaysAfter = new Date();
          threeDaysAfter.setDate(createdAt.getDate() + 3);
          throw new ForbiddenException(
            `운영 정책으로 인해 ${toKRTimeZone(
              threeDaysAfter
            )} 까지 정지된 유저입니다. 문의사항은 고객센터로 연락주세요.`
          );
        }
      } else if (user.status === STATUS_TYPE.SIGNOUT) {
        throw new ForbiddenException('탈퇴한 유저');
      }
      return user;
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
