export interface ConstructorInterface<T = unknown> extends Function {
  new (...args: any[]): T
}

export type Decorator<T> = (target: ConstructorInterface<T>) => void;

export enum ScopeType {
  SERVICE = 'SERVICE',
  PROVIDER = 'PROVIDER',
}

export enum InjectionType {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

interface ManualInjection {
  type: InjectionType.MANUAL;
  data: symbol;
}

interface AutoInjection<T> {
  type: InjectionType.AUTO;
  data: ConstructorInterface<T>;
}

export type Injection<T = unknown> = AutoInjection<T> | ManualInjection;

export interface ServiceData<T = unknown> {
  type: ScopeType;
  class: ConstructorInterface<T>;
  dependencies: Injection[];
}
