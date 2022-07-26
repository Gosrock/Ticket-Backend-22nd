import { PipeTransform } from '@nestjs/common';

export class OrderIdValidationPipe implements PipeTransform {

  transform(value: any) {
	  value = value - 10000;
	  return value;
    }

}