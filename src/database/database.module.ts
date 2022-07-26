import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOption } from './DatabaseOption.interface';

@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseOption): DynamicModule {
    if (options.isTest) {
      return {
        module: DatabaseModule,
        imports: [
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'gosrock22th',
            // database: 'ticket',
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: true,
            logging: false
          })
        ]
      };
    }
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('POSTGRES_HOST'),
            port: configService.get('POSTGRES_PORT'),
            username: configService.get('POSTGRES_USER'),
            password: configService.get('POSTGRES_PASSWORD'),
            // database: configService.get('POSTGRES_DB'),
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: configService.get('NODE_ENV') === false,
            logging: configService.get('NODE_ENV') === 'dev' ? true : false
          })
        })
      ]
    };
  }
}
