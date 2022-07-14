import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private async validateRequest(request: Request) {
    const checkHeader = request.headers.authorization;
    if (!checkHeader) {
      throw new UnauthorizedException('잘못된 헤더 요청');
    }
    if (Array.isArray(checkHeader)) {
      throw new UnauthorizedException('잘못된 헤더 요청');
    }
    const jwtString = checkHeader.split('Bearer ')[1];

    const payload = this.authService.verifyAccessJWT(jwtString);
    const user = await this.userService.findUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException('없는 유저입니다.');
    }
    const newObj: any = request;
    newObj.user = user;
    return true;
  }
}
