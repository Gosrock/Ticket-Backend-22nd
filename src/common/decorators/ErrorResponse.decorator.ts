import {
  applyDecorators,
  HttpException,
  HttpStatus,
  Type
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
  refs
} from '@nestjs/swagger';
import { PageDto } from '../dtos/page/page.dto';
import { ErrorCommonResponse } from '../errors/ErrorCommonResponse.dto';
import { HttpExceptionErrorResponseDto } from '../errors/HttpExceptionError.response.dto';
import { ValidationErrorResponseDto } from '../errors/ValidationError.response.dto';
import { CustomValidationError } from '../errors/ValidtionError';
import { makeInstanceByApiProperty } from '../utils/makeInstanceByApiProperty';

interface ErrorResponseOption {
  /**
   * HttpException을 extend한 에러 타입을 인자로 받습니다.
   * 예시 : BadRequestException
   */
  model: Type<HttpException>;
  /**
   * 예시의 제목을 적습니다
   */
  exampleTitle: string;
  /**
   * 서비스 레이어에서 적었던 오류 메시지를 기술합니다.
   */
  exampleMessageInfo: string | Record<string, Array<string>>;
  /**
   * 어떠한 상황일 때 오류가나는지 기술합니다.
   */
  exampleDescription: string;
}

/**
 * 에러를 손쉽게 적기위한 데코레이터입니다.
 * 기본적으로 status 코드가 같으면 하나밖에 못적기때문에 example을 추가하기위해서 커스텀 하였습니다.
 * @param StatusCode 응답 코드입니다. HttpStatus enum 값을 사용하시면됩니다. 보통사용하시는 BadRequestException은 400번입니다.
 * @param errorResponseOptions ErrorResponseOption[] 같은 코드에 여러 example을 추가하기위한 옵션입니다.
 * @returns
 */
export const ErrorResponse = (
  StatusCode: HttpStatus,
  errorResponseOptions: ErrorResponseOption[]
) => {
  let flagValidationErrorExist = false;
  const examples = errorResponseOptions
    .map((error: ErrorResponseOption) => {
      let innerErrorDto;
      if (error.model === CustomValidationError) {
        flagValidationErrorExist = true;
        if (typeof error.exampleMessageInfo === 'string') {
          throw Error(
            '검증오류는 넘겨줄때 Record<string, Array<string>> 타입으로 주셔야합니다.'
          );
        }
        innerErrorDto = new ValidationErrorResponseDto(
          error.exampleMessageInfo
        );
      } else {
        if (typeof error.exampleMessageInfo !== 'string') {
          throw Error('http오류는 넘겨줄때 string 타입으로 주셔야합니다.');
        }
        innerErrorDto = new HttpExceptionErrorResponseDto(
          StatusCode,
          error.model.name,
          error.exampleMessageInfo
        );
      }
      const commonErrorInstance =
        makeInstanceByApiProperty(ErrorCommonResponse);
      commonErrorInstance.error = innerErrorDto;
      return {
        [error.exampleTitle]: {
          value: commonErrorInstance,
          description: error.exampleDescription
        }
      };
    })
    .reduce(function (result, item) {
      Object.assign(result, item);
      return result;
    }, {}); // null 값 있을경우 필터링
  console.log(examples);
  return applyDecorators(
    ApiExtraModels(
      ErrorCommonResponse,
      HttpExceptionErrorResponseDto,
      ValidationErrorResponseDto
    ),
    ApiResponse({
      status: StatusCode,
      content: {
        'application/json': {
          schema: {
            additionalProperties: { $ref: getSchemaPath(ErrorCommonResponse) },
            oneOf: flagValidationErrorExist
              ? [
                  { $ref: getSchemaPath(ValidationErrorResponseDto) },
                  { $ref: getSchemaPath(HttpExceptionErrorResponseDto) }
                ]
              : [{ $ref: getSchemaPath(HttpExceptionErrorResponseDto) }]
          },
          examples: examples
        }
      }
    })
  );
};
