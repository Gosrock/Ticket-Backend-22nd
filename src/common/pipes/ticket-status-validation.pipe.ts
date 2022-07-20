import { BadRequestException, PipeTransform } from '@nestjs/common';
import e from 'express';
import { TicketStatus } from '../consts/enum';

export class TicketStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [TicketStatus.DONE, TicketStatus.WAIT];

  transform(value: any) {
    if (typeof value === 'object') {
      const { status } = value;
      if (this.StatusOptions.indexOf(status) === -1) {
        throw new BadRequestException(
          `${status} is not in the TicketStatus options`
        );
      }
    } else {
      if (this.StatusOptions.indexOf(value) === -1) {
        throw new BadRequestException(
          `${value} is not in the TicketStatus options`
        );
      }
    }

    return value;
  }
}
