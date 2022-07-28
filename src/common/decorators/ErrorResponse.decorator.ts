import { applyDecorators, Type } from '@nestjs/common';
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

/**
 * 제네릭을 활용한 swagger 응답을 주기위한 용도입니다.
 * @param props model : 원래 응답할 data의 타입 , description 응답 설명
 * @returns
 */
export const ErrorResponse = <TModel extends Type<any>>(props: {
  model: TModel;
  description?: string;
}) => {
  return applyDecorators(
    ApiExtraModels(
      ErrorCommonResponse,
      ValidationErrorResponseDto,
      HttpExceptionErrorResponseDto
    ),
    ApiResponse({
      description:
        '최초회원가입 한 유저면 registerToken을 , 이후 로그인 한 사람이면 accessToken을 발급합니다.',
      content: {
        'application/json': {
          schema: {
            additionalProperties: { $ref: getSchemaPath(ErrorCommonResponse) },

            oneOf: [
              { $ref: getSchemaPath(ValidationErrorResponseDto) },
              { $ref: getSchemaPath(HttpExceptionErrorResponseDto) }
            ]
            // anyOf: [
            //   { type: string },
            //   { type: getSchemaPath(HttpExceptionErrorResponseDto) }
            // ]
            // {
            //   $ref: getSchemaPath(
            //     ErrorCommonResponse<HttpExceptionErrorResponseDto>
            //   ),
            //   properties: {
            //     error: {
            //       description: 'adst',
            //       $ref: getSchemaPath(HttpExceptionErrorResponseDto)
            //     }
            //   }
            // }
          },
          examples: {
            검증오류: {
              value: makeInstanceByApiProperty(
                ErrorCommonResponse<ValidationErrorResponseDto>,
                ValidationErrorResponseDto
              ),
              description:
                '리턴된 registerToken을 Bearer <registerToken> 형식으로 집어넣으시면됩니다.'
            },
            'http 오류': {
              value: makeInstanceByApiProperty(
                ErrorCommonResponse<HttpExceptionErrorResponseDto>,
                HttpExceptionErrorResponseDto
              ),
              description:
                '리턴된 registerToken을 Bearer <registerToken> 형식으로 집어넣으시면됩니다.'
            }
            // '이미 회원가입한 유저일때': {
            //   value: makeInstanceByApiProperty(LoginResponseDto)
            // }
          }
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
