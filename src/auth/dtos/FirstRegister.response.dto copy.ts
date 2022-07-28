import { PickType } from '@nestjs/swagger';
import { Order } from 'src/database/entities/order.entity';
import { BaseResponseValidateNumberDto } from './BaseValidateNumber.response.dto';

export class FirstReigsterDto extends PickType(BaseResponseValidateNumberDto, [
  'registerToken',
  'alreadySingUp'
] as const) {}
