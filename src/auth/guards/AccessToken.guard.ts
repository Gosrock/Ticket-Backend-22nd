import { Request } from 'express';
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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

  private async validateRequest(request: Request) {
    const checkHeader = request.headers.authorization;
    if (!checkHeader) {
      return false;
    }
    if (Array.isArray(checkHeader)) {
      return false;
    }
    const jwtString = checkHeader.split('Bearer ')[1];

    const { phoneNumber } = this.authService.verifyRegisterJWT(jwtString);
    const userAlreadySignup = await this.authService.checkUserAlreadySignUp(
      phoneNumber
    );

    return !userAlreadySignup;
  }
}
