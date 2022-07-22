import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomConfigModule } from 'src/config/customConfig.module';
import { SmsService } from './sms.service';

describe('SmsService', () => {
  let service: SmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CustomConfigModule,
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            baseURL: 'https://sens.apigw.ntruss.com/sms/v2/services/',
            headers: {
              'Content-type': 'application/json; charset=utf-8',
              'x-ncp-iam-access-key': '' + configService.get('NAVER_ACCESS_KEY')
            }
          }),
          inject: [ConfigService]
        })
      ],
      providers: [SmsService]
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
