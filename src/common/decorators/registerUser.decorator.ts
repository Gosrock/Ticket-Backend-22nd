import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RegisterUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // //console.log('asdfasdfasd');

    const requestUser = request.requestUser;

    return requestUser;
  }
);
