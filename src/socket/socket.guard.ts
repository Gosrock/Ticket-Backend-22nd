import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/consts/enum';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketGuard implements CanActivate {
  private readonly logger = new Logger(SocketGuard.name);
  constructor(private authService: AuthService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    return this.validateHeader(client, context);
  }

  public async validateHeader(client: Socket, context: ExecutionContext) {
    //가드에 걸리면 에러 리턴 + 소켓 강제 연결 종료
    try {
      const accessToken =
        process.env.NODE_ENV == 'dev'
          ? client.handshake.headers.authorization
          : client.handshake.auth?.accessToken;

      if (!accessToken) {
        throw new UnauthorizedException('잘못된 헤더 요청');
      }
      if (Array.isArray(accessToken)) {
        throw new UnauthorizedException('잘못된 헤더 요청');
      }
      const payload = this.authService.verifyAccessJWT(accessToken);

      const roles = this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass()
      ]);

      const user = await this.authService.findUserById(payload.id);
      if (!user) {
        throw new UnauthorizedException('없는 유저입니다.');
      }
      const newObj: any = client;
      newObj.user = user;
      context.switchToWs().getData().user = user;

      // 롤기반 체크
      if (!roles) {
        return true;
      }
      if (!roles.length) {
        return true;
      } else {
        if (roles.includes(user.role) === true) {
          return true;
        } else if (user.role === Role.Admin) {
          return true;
        } else {
          throw new UnauthorizedException('권한이 없습니다.');
        }
      }
    } catch (e) {
      this.logger.error(
        `${client.id} 연결 강제 종료, status: ${e.status}, ${e.message}`
      );
      client.disconnect();
      throw new WsException(e.message);
    }
  }
}
