import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessInterceptor } from './common/interceptors/sucess.interceptor';
import { setupSwagger } from './common/utils/swagger';
import 'reflect-metadata';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities
} from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'prod' ? 'warn' : 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('TicketBackend', {
              prettyPrint: true
            })
          )
        })
      ]
    })
  });
  // 브라우저 캐싱 없앰
  app.getHttpAdapter().getInstance().set('etag', false);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
    // prefix: '/v',
  });
  app.enableCors({ origin: true, credentials: true });

  // 글로벌로 class 직렬화 선택
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // 성공시 인터셉터
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      // transform으로 형식변환가능한지 체크 dto에 transfrom 없어도 typescript type 보고 형변환 해줌
      //  enableImplicitConversion 옵션은 타입스크립트의 타입으로 추론가능하게 설정함
      transform: true,
      transformOptions: { enableImplicitConversion: true }
      // forbidNonWhitelisted: true,
    })
  );
  setupSwagger(app);

  const PORT = process.env.PORT as string;

  await app.listen(PORT);
  console.log(`Application is running on: ${PORT} ${await app.getUrl()}`);
}

bootstrap();
