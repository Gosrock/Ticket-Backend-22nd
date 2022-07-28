// @ApiResponse({
//     description:
//       '최초회원가입 한 유저면 registerToken을 , 이후 로그인 한 사람이면 accessToken을 발급합니다.',
//     content: {
//       'application/json': {
//         schema: {
//           oneOf: [
//             { $ref: getSchemaPath(FirstReigsterDto) },
//             { $ref: getSchemaPath(LoginResponseDto) }
//           ]
//         },
//         examples: {
//           '최초 (회원가입 안한 유저일때 )': {
//             value: makeInstanceByApiProperty(FirstReigsterDto),
//             description:
//               '리턴된 registerToken을 Bearer <registerToken> 형식으로 집어넣으시면됩니다.'
//           },
//           '이미 회원가입한 유저일때': {
//             value: makeInstanceByApiProperty(LoginResponseDto)
//           }
//         }
//       }
//     }
//   })

import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { plainToClassFromExist } from 'class-transformer';
import { SuccessCommonResponseDto } from '../dtos/SuccessCommonResponse.dto';
import { makeInstanceByApiProperty } from '../utils/makeInstanceByApiProperty';

interface SuccessResponseOption {
  /**
   * HttpException을 extend한 에러 타입을 인자로 받습니다.
   * 예시 : BadRequestException
   */
  model: Type<any>;
  /**
   * 예시의 제목을 적습니다
   */
  exampleTitle: string;
  /**
   * 서비스 레이어에서 적었던 오류 메시지를 기술합니다.
   */
  exampleDataOfDTO: Record<string, any>;
  /**
   * 어떠한 상황일 때 예시형태의 응답값을 주는지 기술 합니다.
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
export const SuccessResponse = (
  StatusCode: HttpStatus,
  succesResponseOptions: SuccessResponseOption[]
) => {
  const flagValidationErrorExist = false;
  const examples = succesResponseOptions
    .map((response: SuccessResponseOption) => {
      const commonResponseInstance = makeInstanceByApiProperty(
        SuccessCommonResponseDto
      );
      const dtoData = makeInstanceByApiProperty(response.model);
      //   console.log(dtoData);
      commonResponseInstance.data = plainToClassFromExist(
        dtoData,
        response.exampleDataOfDTO,

        { excludeExtraneousValues: true }
      );
      console.log(commonResponseInstance);
      return {
        [response.exampleTitle]: {
          value: commonResponseInstance,
          description: response.exampleDescription
        }
      };
    })
    .reduce(function (result, item) {
      Object.assign(result, item);
      return result;
    }, {}); // null 값 있을경우 필터링
  //   console.log(examples);
  return applyDecorators(
    ApiExtraModels(
      SuccessCommonResponseDto,
      succesResponseOptions.map(e => {
        return e.model;
        // eslint-disable-next-line @typescript-eslint/ban-types
      }) as unknown as Function
    ),
    ApiResponse({
      status: StatusCode,
      content: {
        'application/json': {
          schema: {
            additionalProperties: {
              $ref: getSchemaPath(SuccessCommonResponseDto)
            },
            oneOf: succesResponseOptions.map(e => {
              return { $ref: getSchemaPath(e.model) };
            })
          },
          examples: examples
        }
      }
    })
  );
};
