import { container } from '@/di/container';
import { defineInjectionToken, setScopeType } from '@/di/reflection';
import { ConstructorInterface, Decorator, ScopeType } from '@/di/types';

export const SceneInjectionToken = Symbol('Scene');

export const Injectable = <T> (): Decorator<T> => {
  return (target): void => {
    setScopeType(target, ScopeType.SERVICE);
    container.register(target);
  };
};

export const Provider = <T> (): Decorator<T> => {
  return (target): void => {
    setScopeType(target, ScopeType.PROVIDER);
    container.register(target);
  };
};

export const UseScene = <T> (): (target: ConstructorInterface<T>, key: string | symbol, index: number) => void => {
  return (target, key, index): void => {
    defineInjectionToken(target, SceneInjectionToken, index);
  };
};
