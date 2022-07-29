/* eslint-disable @typescript-eslint/ban-types */
import { ApiPropertyOptions } from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';
import { mergeObjects } from './mergeTwoObj';

const DECORATORS_PREFIX = 'swagger';
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`;
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

// source form lodash
function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

function isFunction(value): value is Function {
  if (!isObject(value)) {
    return false;
  }
  return true;
}

function isLazyTypeFunc(
  type: Function | Type<unknown>
): type is { type: Function } & Function {
  return isFunction(type) && type.name == 'type';
}

function isPrimitiveType(
  type:
    | string
    | Function
    | Type<unknown>
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
export function makeInstanceByApiProperty<T>(
  dtoClass: Type,
  generic?: Type
): T {
  //console.log('name', dtoClass);

  // 디티오로 생성자를 만들지 않고 해당 타입만 가져옴.
  // 생성자에 인자가 들어간경우 에러가 남.

  const mappingDto = {};

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
    if (propertyType) {
      if (propertyType === 'generic') {
        if (generic) {
          // dto[property.fieldName] = makeInstanceByApiProperty(
          //   dto[property.fieldName + 'Type']
          // );
          console.log('asdfasdfadsfasdfasdfasdfasdfasdfasdfasdf', properties);

          if (property.isArray) {
            mappingDto[property.fieldName] = [
              makeInstanceByApiProperty(generic)
            ];
          } else {
            mappingDto[property.fieldName] = makeInstanceByApiProperty(generic);
          }
        }
      } else if (propertyType === 'string') {
        // 스트링 형태의 enum
        if (typeof property.example !== 'undefined') {
          mappingDto[property.fieldName] = property.example;
        } else {
          mappingDto[property.fieldName] = property.description;
        }
        console.log(
          'fiste',
          propertyType,
          property,
          mappingDto[property.fieldName]
        );
      } else if (propertyType === 'number') {
        // 숫자형태의 enum
        if (typeof property.example !== 'undefined') {
          mappingDto[property.fieldName] = property.example;
        } else {
          mappingDto[property.fieldName] = property.description;
        }
        console.log('fiste', propertyType, mappingDto[property.fieldName]);
      } else if (isPrimitiveType(propertyType)) {
        // 원시타입 [String, Boolean, Number]
        console.log('asdfasdfas', propertyType);
        if (typeof property.example !== 'undefined') {
          mappingDto[property.fieldName] = property.example;
        } else {
          mappingDto[property.fieldName] = property.description;
        }
        // console.log('fiste', propertyType, dto[property.fieldName]);
      } else if (isLazyTypeFunc(propertyType as Function | Type<unknown>)) {
        // type: () => PageMetaDto  형태의 lazy
        const constructorType = (propertyType as Function)();
        // if (propertyType.name === 'type') {
        // const text = property.example
        //   ? property.example
        //   : property.description;
        // dto[property.fieldName] = '[타입이있습니다 스키마 확인요망]' + text;
        if (property.isArray) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(constructorType)
          ];
        } else {
          mappingDto[property.fieldName] =
            makeInstanceByApiProperty(constructorType);
        }
      } else if (checkType(propertyType)) {
        //lazy import like () => DTO 레이지 인풋은  내가 해결을 못하겠음..
        // console.log('fiste', propertyType, dto[property.fieldName]);

        if (property.isArray) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(propertyType)
          ];
        } else {
          mappingDto[property.fieldName] =
            makeInstanceByApiProperty(propertyType);
        }
      }
    }
  }
  console.log(mappingDto);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // delete (dtoClass as any).constructor;
  // // delete dtoClass.constructor;
  // console.log(dtoClass);
  // const dto = new dtoClass();

  return mappingDto as T;
}
