import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class RegisterTokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    const checkHeader = request.headers.registertoken;

    console.log(request.headers);
    if (!checkHeader) {
      throw new UnauthorizedException('잘못된 헤더 요청');
    }
    if (Array.isArray(checkHeader)) {
      throw new UnauthorizedException('잘못된 헤더 요청');
    }
    const jwtString = checkHeader.split('Bearer ')[1];
    const payload = this.authService.verifyRegisterJWT(jwtString);
    const newObj: any = request;
    newObj.requestUser = payload;

    return true;
  }
}
