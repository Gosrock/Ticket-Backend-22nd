import { Expose } from 'class-transformer';

export class ValidationNumberDto {
  // 직렬화
  @Expose()
  validationNumber: string;
}
