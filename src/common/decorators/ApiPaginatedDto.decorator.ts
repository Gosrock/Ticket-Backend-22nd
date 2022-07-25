import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from '../dtos/page/page.dto';

/**
 * 제네릭을 활용한 swagger 응답을 주기위한 용도입니다.
 * @param props model : 원래 응답할 data의 타입 , description 응답 설명
 * @returns
 */
export const ApiPaginatedDto = <TModel extends Type<any>>(props: {
  model: TModel;
  description?: string;
}) => {
  return applyDecorators(
    ApiExtraModels(PageDto, props.model),
    ApiOkResponse({
      description: props.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(props.model) }
              }
            }
          }
        ]
      }
    })
  );
};
