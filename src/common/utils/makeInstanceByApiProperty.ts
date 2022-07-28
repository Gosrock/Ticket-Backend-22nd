import { ApiPropertyOptions } from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';

const DECORATORS_PREFIX = 'swagger';
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`;
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

function isPrimitiveType(
  type:
    | string
    // eslint-disable-next-line @typescript-eslint/ban-types
    | Function
    | Type<unknown>
    // eslint-disable-next-line @typescript-eslint/ban-types
    | [Function]
    | Record<string, any>
    | undefined
): boolean {
  return (
    typeof type === 'function' &&
    [String, Boolean, Number].some(item => item === type)
  );
}

function checkType(object: any): object is Type {
  return object;
}

type ApiPropertyOptionsWithFieldName = ApiPropertyOptions & {
  fieldName: string;
};
export function makeInstanceByApiProperty(dtoClass: Type, generic?: Type) {
  console.log('name', dtoClass);

  const dto = new dtoClass(generic);

  const propertiesArray: string[] =
    Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dtoClass.prototype) || [];

  const properties: ApiPropertyOptionsWithFieldName[] = propertiesArray.map(
    field => {
      const obj = Reflect.getMetadata(
        API_MODEL_PROPERTIES,
        dtoClass.prototype,
        field.substring(1)
      );
      obj.fieldName = field.substring(1);
      return obj;
    }
  );
  console.log('asdfasdfadsfasdfasdfasdfasdfasdfasdfasdf', properties);

  //   dto.
  for (const propertie of properties) {
    if (propertie.type === 'generic') {
      // const reflectedType = (Reflect as any).getMetadata(
      //   'design:type',
      //   dtoClass.prototype,
      //   propertie.fieldName
      // );
      // console.log(reflectedType.options);
      // makeInstanceByApiProperty(reflectedType);
      // meta.find
      if (generic) {
        console.log(dto[propertie.fieldName + 'Type']);
        dto[propertie.fieldName] = makeInstanceByApiProperty(
          dto[propertie.fieldName + 'Type']
        );
      }

      // new SuperCollection<User>(User)
      // dto[propertie.fieldName] = plainToInstance();
    } else if (typeof propertie.type === 'string' || 'number') {
      if (typeof propertie.example !== 'undefined') {
        dto[propertie.fieldName] = propertie.example;
      } else {
        dto[propertie.fieldName] = propertie.description;
      }
    } else if (isPrimitiveType(propertie.type)) {
      //   console.log('asdfasdfas', propertie.type);
      if (typeof propertie.example !== 'undefined') {
        dto[propertie.fieldName] = propertie.example;
      } else {
        dto[propertie.fieldName] = propertie.description;
      }

      console.log('asdfasdfas', propertie.example, dto[propertie.fieldName]);
    } else if (checkType(propertie.type)) {
      //lazy import like () => DTO 레이지 인풋은  내가 해결을 못하겠음..
      if (propertie.type.name === 'type') {
        const text = propertie.example
          ? propertie.example
          : propertie.description;
        dto[propertie.fieldName] = '[타입이있습니다 스키마 확인요망]' + text;
      } else {
        if (propertie.isArray) {
          dto[propertie.fieldName] = [
            makeInstanceByApiProperty(propertie.type)
          ];
        } else {
          dto[propertie.fieldName] = makeInstanceByApiProperty(propertie.type);
        }
      }
    }
  }
  return dto;
  //   console.log(new properties.type());
}
