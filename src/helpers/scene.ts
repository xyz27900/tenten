import Phaser from 'phaser';
import { container } from '@/di/container';
import { SceneInjectionToken } from '@/di/decorators';
import { ConstructorInterface } from '@/di/types';

export class Scene extends Phaser.Scene {
  private static injectScene(scene: Scene): Record<symbol, Scene> {
    return { [SceneInjectionToken]: scene };
  }

  public getComponent<T extends Phaser.GameObjects.GameObject>(component: ConstructorInterface<T>): T {
    return container.resolve(component, Scene.injectScene(this));
  }
}
