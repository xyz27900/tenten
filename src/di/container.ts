import { collectDependencies, getScopeType } from '@/di/reflection';
import { ConstructorInterface, Injection, InjectionType, ScopeType, ServiceData } from '@/di/types';

class Container {
  private readonly providers: Map<ConstructorInterface, unknown>;
  private readonly registrations: Map<ConstructorInterface, ServiceData>;

  constructor() {
    this.providers = new Map();
    this.registrations = new Map();
  }

  public register<T>(target: ConstructorInterface<T>): void {
    if (this.registrations.has(target)) {
      throw new Error(`The injection ${target.name} has been already registered`);
    }

    const serviceData: ServiceData<T> = {
      type: getScopeType(target),
      class: target,
      dependencies: collectDependencies(target),
    };

    this.registrations.set(target, serviceData);
  }

  public resolve<T>(target: ConstructorInterface<T>, injectionsMap: Record<symbol, unknown> = {}): T {
    const serviceData = this.getServiceData(target);
    const dependencies = this.collectDependencies(serviceData.dependencies, injectionsMap);

    if (serviceData.type === ScopeType.PROVIDER && this.providers.has(target)) {
      return this.providers.get(target) as T;
    }

    const instance = new serviceData.class(...dependencies);
    if (serviceData.type === ScopeType.PROVIDER) {
      this.providers.set(target, instance);
    }

    return instance;
  }

  private collectDependencies(dependencies: Injection[], injectionMap: Record<symbol, unknown>): unknown[] {
    return dependencies.map(dependency => {
      if (dependency.type === InjectionType.AUTO) {
        return this.resolve(dependency.data);
      } else {
        return injectionMap[dependency.data];
      }
    });
  }

  private getServiceData<T>(target: ConstructorInterface<T>): ServiceData<T> {
    const data = this.registrations.get(target);
    if (!data) {
      throw new Error(`The injection ${target.name} has not been registered`);
    } else {
      return data as ServiceData<T>;
    }
  }
}

export const container = new Container();
