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
import { mergeObjects } from '../utils/mergeTwoObj';

interface SuccessResponseOption {
  /**
   * 응답 디티오를 인자로받습니다
   * 예시 : ResponseRequestValidationDto
   */
  model: Type<any>;
  /**
   * 예시의 제목을 적습니다
   */
  exampleTitle: string;
  /**
   *  깊은 복사로 변경하고 싶은 응답값을 적습니다. 오버라이트 됩니다.
   *  nested 된 obj 인 경우엔 해당 obj 가 바뀌는것이아닌 안에 있는 property만 바뀝니다.
   *  즉 주어진 객체로 리프 프로퍼티에 대해 오버라이트됩니다.
   */
  overwriteValue?: Record<string, any>;
  /**
   * 어떠한 상황일 때 예시형태의 응답값을 주는지 기술 합니다.
   */
  exampleDescription: string;
}

/**
 * 여러 응답값을 손쉽게 적기위한 데토레이터 입니다
 * 기본적으로 status 코드가 같으면 하나밖에 못적기때문에 example을 추가하기위해서 커스텀 하였습니다.
 * @param StatusCode 응답 코드입니다. HttpStatus enum 값을 사용하시면됩니다.
 * @param errorResponseOptions SuccessResponseOption[] 같은 코드에 여러 example을 추가하기위한 옵션입니다.
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
      commonResponseInstance.data = mergeObjects(
        {},
        dtoData,
        response.overwriteValue
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
  const pathsOfDto = succesResponseOptions.map(e => {
    return { $ref: getSchemaPath(e.model) };
  });
  const extraModel = succesResponseOptions.map(e => {
    return e.model;
    // eslint-disable-next-line @typescript-eslint/ban-types
  }) as unknown as Function[];
  console.log(pathsOfDto);
  return applyDecorators(
    ApiExtraModels(...extraModel, SuccessCommonResponseDto),
    ApiResponse({
      status: StatusCode,
      content: {
        'application/json': {
          schema: {
            additionalProperties: {
              $ref: getSchemaPath(SuccessCommonResponseDto)
            },
            oneOf: pathsOfDto
          },
          examples: examples
        }
      }
    })
  );
};
