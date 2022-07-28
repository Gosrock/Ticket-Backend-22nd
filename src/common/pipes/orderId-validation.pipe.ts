import { PipeTransform } from '@nestjs/common';
import { IsNumber } from 'class-validator';

export class OrderIdValidationPipe implements PipeTransform {

  transform(value: any) {
	  value = value - 10000;
	  return value;
    }

}