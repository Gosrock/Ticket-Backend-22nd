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
        description: `accessToken`,
        name: 'authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header'
      },
      'accessToken'
    )
    .addApiKey(
      {
        type: 'apiKey', // this should be apiKey
        name: 'registertoken', // this is the name of the key you expect in header
        in: 'header',
        description:
          '회원가입을 위한 토큰을 집어넣어야합니다. 앞에 Bearer 붙이세요 !!'
      },
      'registerToken'
    ) // This name here is important for matching up with @ApiBearerAuth() in your controller!)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
