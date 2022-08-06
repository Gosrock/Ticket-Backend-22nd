import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessJwtPayload } from 'src/auth/auth.interface';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // //console.log('asdfasdfasd');

    const userObj = request.user as AccessJwtPayload;

    return userObj;
  }
);
