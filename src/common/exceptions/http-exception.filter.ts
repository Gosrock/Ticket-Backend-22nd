import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SlackService } from 'src/slack/slack.service';
import { ErrorCommonResponse } from '../errors/ErrorCommonResponse.dto';
import { HttpExceptionErrorResponseDto } from '../errors/HttpExceptionError.response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private slackService: SlackService) {}
  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let error: HttpExceptionErrorResponseDto;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const getError = exception.getResponse();
      if (typeof getError === 'string') {
        error = {
          error: exception.name,
          message: getError,
          statusCode: statusCode
        };
      } else {
        // 에러 코드화를 진행할 부분
        error = {
          ...(getError as HttpExceptionErrorResponseDto),
          error: exception.name,
          statusCode: statusCode
        };
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      // error = 'Internal server error';
      const errorResponse = {
        statusCode,
        timestamp: new Date(),
        path: request.url,
        method: request.method,
        error: {
          error: 'Internal server error',
          statusCode: statusCode,
          message: '서버에러 관리자한테 문의 주세요'
        }
      };
      Logger.error(
        'ExceptionsFilter',
        exception.stack,
        request.method + request.url
      );
      await this.slackService.backendInternelServerError(
        request.method + request.url,
        JSON.stringify(request.body),
        exception.stack
      );

      return response.status(statusCode).json(errorResponse);
    }

    // //console.log(error);

    const errorResponse: ErrorCommonResponse<HttpExceptionErrorResponseDto> = {
      statusCode,
      timestamp: new Date(),
      path: request.url,
      method: request.method,
      error: error
    };

    Logger.warn('errorResponse', JSON.stringify(errorResponse));

    return response.status(statusCode).json(errorResponse);
  }
}
