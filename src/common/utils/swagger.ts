import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as basicAuth from 'express-basic-auth';

export function setupSwagger(app: INestApplication): void {
  const SWAGGER_USER = process.env.SWAGGER_USER as string;

  app.use(
    ['/api-docs'],
    basicAuth({
      challenge: true,
      users: {
        [SWAGGER_USER]: process.env.SWAGGER_PASSWORD as string
      }
    })
  );

  const swaggerInfo = fs.readFileSync('swagger-info.md', 'utf-8');

  const options = new DocumentBuilder()
    .setTitle('고스락 티켓예매 백엔드 api')
    .setDescription(swaggerInfo)
    .setVersion('0.0.1')
    // .addServer('api/v1')
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `인증서버에서 받은 accessToken을 집어넣어주세요`,
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header'
      },
      'accessToken'
    ) // This name here is important for matching up with @ApiBearerAuth() in your controller!)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
