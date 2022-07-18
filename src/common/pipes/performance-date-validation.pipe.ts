import { BadRequestException, PipeTransform } from '@nestjs/common';
import { PerformanceDate } from '../consts/enum';

export class PerformanceDateValidationPipe implements PipeTransform {
  readonly StatusOptions = [PerformanceDate.OB, PerformanceDate.YB];

  transform(value: any) {
    if (this.StatusOptions.indexOf(value) === -1) {
      throw new BadRequestException(
        `${value} is not in the TicketStatus options`
      );
    }

    return value;
  }
}
