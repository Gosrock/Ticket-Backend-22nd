import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async sendMessages(messages: Message[]) {
    try {
      const data = await lastValueFrom(
        this.httpService
          .get('/users.lookupByEmail', {
            params: { email }
          })
          .pipe(map(response => response.data))
      );
      // Logger.log(data);

      if (data.ok !== true) {
        return null;
      }

      return data.user.id;
    } catch (error) {
      Logger.log(error);
      return null;
    }
  }
}
