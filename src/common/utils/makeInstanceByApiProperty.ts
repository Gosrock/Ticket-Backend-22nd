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
  //console.log('name', dtoClass);

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
  // console.log('asdfasdfadsfasdfasdfasdfasdfasdfasdfasdf', properties);

  //   dto.
  for (const property of properties) {
    const propertyType = property.type;

    if (propertyType === 'generic') {
      if (generic) {
        dto[property.fieldName] = makeInstanceByApiProperty(
          dto[property.fieldName + 'Type']
        );
      }
    } else if (propertyType === 'string') {
      if (typeof property.example !== 'undefined') {
        dto[property.fieldName] = property.example;
      } else {
        dto[property.fieldName] = property.description;
      }
      // console.log('fiste', propertyType, property, dto[property.fieldName]);
    } else if (propertyType === 'number') {
      if (typeof property.example !== 'undefined') {
        dto[property.fieldName] = property.example;
      } else {
        dto[property.fieldName] = property.description;
      }
      // console.log('fiste', propertyType, dto[property.fieldName]);
    } else if (isPrimitiveType(propertyType)) {
      //   //console.log('asdfasdfas', propertyType);
      if (typeof property.example !== 'undefined') {
        dto[property.fieldName] = property.example;
      } else {
        dto[property.fieldName] = property.description;
      }
      // console.log('fiste', propertyType, dto[property.fieldName]);
    } else if (checkType(propertyType)) {
      //lazy import like () => DTO 레이지 인풋은  내가 해결을 못하겠음..
      // console.log('fiste', propertyType, dto[property.fieldName]);
      if (propertyType.name === 'type') {
        const text = property.example ? property.example : property.description;
        dto[property.fieldName] = '[타입이있습니다 스키마 확인요망]' + text;
      } else {
        if (property.isArray) {
          dto[property.fieldName] = [makeInstanceByApiProperty(propertyType)];
        } else {
          dto[property.fieldName] = makeInstanceByApiProperty(propertyType);
        }
      }
    }
  }
  return dto;
  //   //console.log(new propertys.type());
}
