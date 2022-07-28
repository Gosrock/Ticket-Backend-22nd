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
  // 응답 에러 dto 모델입니다.
  model: Type<HttpException>;
  // 응답 에러 example의제목입니다
  exampleTitle: string;
  // 응답 에러 메시지 입니다.
  exampleMessageInfo: string | Record<string, Array<string>>;
  // 응답 에러 설명 ( 어떠할 때 오류가 나는지)
  exampleDescription: string;
}

/**
 * 제네릭을 활용한 swagger 응답을 주기위한 용도입니다.
 * @param props model : 원래 응답할 data의 타입 , description 응답 설명
 * @returns
 */
export const ErrorResponse = (
  StatusCode: HttpStatus,
  errorResponseOptions: ErrorResponseOption[]
) => {
  const examples = errorResponseOptions
    .map((error: ErrorResponseOption) => {
      let innerErrorDto;
      if (error.model === CustomValidationError) {
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
    ApiExtraModels(ErrorCommonResponse, HttpExceptionErrorResponseDto),
    ApiResponse({
      status: StatusCode,
      content: {
        'application/json': {
          schema: {
            additionalProperties: { $ref: getSchemaPath(ErrorCommonResponse) },
            oneOf: errorResponseOptions.map(e => {
              return {
                $ref: getSchemaPath(HttpExceptionErrorResponseDto)
              };
            })
          },
          examples: examples
        }
      }
    })
  );
};

// examples: {
//       '최초 (회원가입 안한 유저일때 )': {
//         value: makeInstanceByApiProperty(FirstReigsterDto),
//         description:
//           '리턴된 registerToken을 Bearer <registerToken> 형식으로 집어넣으시면됩니다.'
//       },
//       '이미 회원가입한 유저일때': {
//         value: makeInstanceByApiProperty(LoginResponseDto)
//       }
//     }
// ApiResponse({
//   description: props.description,
//   schema: {
//     allOf: [
//       { $ref: getSchemaPath(ErrorCommonResponse) },
//       {
//         properties: {
//           error: { $ref: getSchemaPath(props.model) }
//         }
//       }
//     ]
//   }
// })
