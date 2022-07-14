import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    // console.log('Before...');
    // const now = Date.now();
    const statusCode = context
      .switchToHttp()
      .getResponse<Response>().statusCode;

    return next
      .handle()
      .pipe(map(data => ({ statusCode, success: true, data })));
  }
}
