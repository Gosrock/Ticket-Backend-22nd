import { PipeTransform } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { number } from 'joi';

export class OrderIdValidationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'number') {
      value -= 10000;
    } else {
      //body의 요소일 경우
      value.orderId -= 10000;
    }
    return value;
  }
}
