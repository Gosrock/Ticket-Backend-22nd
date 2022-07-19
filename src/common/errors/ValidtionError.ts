import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export class CustomValidationError extends HttpException {
  constructor(valdationErrorArray: ValidationError[]) {
    const objectsOfError = valdationErrorArray
      .map((error: ValidationError) => {
        const constrains = error.constraints;
        if (!constrains) return null;

        const constrainsErrorStrings = Object.keys(constrains).map(
          key => constrains[key]
        );
        return { [error.property]: constrainsErrorStrings };
      })
      .filter(e => e)
      .reduce(function (result, item) {
        // 중복값 없다고 가정 object 머지
        if (!item) return result;
        if (!result) return result;
        Object.assign(result, item);
        return result;
      }, {}); // null 값 있을경우 필터링
    super(
      {
        error: 'Validation Error',
        message: '검증 오류',
        validationErrorInfo: objectsOfError,
        statusCode: HttpStatus.BAD_REQUEST
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
