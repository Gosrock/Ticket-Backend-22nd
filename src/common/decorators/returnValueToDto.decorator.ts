import { plainToInstance } from 'class-transformer';

export const returnValueToDto =
  dto =>
  (
    target,
    key: string,
    // name of the func
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // const a = args.map((a) => JSON.stringify(a)).join();
      const result = await originalMethod.apply(this, args);
      // call the function
      // const r = JSON.stringify(result);
      // console.log(`Call: ${key}(${a}) => ${r}`);
      return plainToInstance(dto, result, { excludeExtraneousValues: true });
    };

    return descriptor;
  };
