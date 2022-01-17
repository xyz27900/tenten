import { ConstructorInterface, Injection, InjectionType, ScopeType } from '@/di/types';

const METADATA_PARAM_TYPES = 'design:paramtypes';
const METADATA_INJECTION_TYPE = 'design:injection:type';
const METADATA_INJECTION_TOKEN = 'design:injection:token';

export const collectDependencies = <T> (target: ConstructorInterface<T>): Injection[] => {
  const dependencies: ConstructorInterface[] = Reflect.getMetadata(METADATA_PARAM_TYPES, target) || [];
  const injectionTokens = getInjectionTokens(target);
  const injectionParamIndexes = injectionTokens.map((_, index) => index);

  return dependencies.reduce((result, dependency, index) => {
    if (injectionParamIndexes.includes(index)) {
      result[index] = injectionTokens[index];
    } else {
      result[index] = {
        type: InjectionType.AUTO,
        data: dependency,
      };
    }

    return result;
  }, [] as Injection[]);
};

export const getScopeType = <T> (target: ConstructorInterface<T>): ScopeType => {
  const injectionType = Reflect.getMetadata(METADATA_INJECTION_TYPE, target);
  return injectionType ?? ScopeType.SERVICE;
};

export const setScopeType = <T> (target: ConstructorInterface<T>, scopeType: ScopeType): void => {
  Reflect.defineMetadata(METADATA_INJECTION_TYPE, scopeType, target);
};

export const getInjectionTokens = <T> (target: ConstructorInterface<T>): Injection[] => {
  return Reflect.getMetadata(METADATA_INJECTION_TOKEN, target) ?? [];
};

export const defineInjectionToken = <T> (target: ConstructorInterface<T>, token: symbol, paramIndex: number): void => {
  const descriptors: Injection[] = Reflect.getMetadata(METADATA_INJECTION_TOKEN, target) ?? [];
  descriptors[paramIndex] = {
    type: InjectionType.MANUAL,
    data: token,
  };
  Reflect.defineMetadata(METADATA_INJECTION_TOKEN, descriptors, target);
};
