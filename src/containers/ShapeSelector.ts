import Phaser from 'phaser';
import { TILE_SIZE } from '@/config';
import { Injectable, UseScene } from '@/di/decorators';
import { ShapeButton } from '@/objects/ShapeButton';
import { ShapesService } from '@/services/shapes.service';
import { computed } from '@/utils/observables';

@Injectable()
export class ShapeSelector extends Phaser.GameObjects.Container {
  private readonly shapesService: ShapesService;

  constructor(@UseScene() scene: Phaser.Scene, shapesService: ShapesService) {
    super(scene);
    this.shapesService = shapesService;
    this.create();
  }

  private static get buttonSize(): number {
    return TILE_SIZE * 10 / 3;
  }

  private create(): void {
    const { selectedIdx, shapes, lockedShapes } = this.shapesService;

    const buttons = shapes.value.map((shape, index) => {
      const shapeButton = new ShapeButton(
        this.scene,
        computed(() => shapes.value[index]),
        computed(() => index === selectedIdx.value),
        computed(() => lockedShapes.value.includes(index)),
        ShapeSelector.buttonSize,
      );
      shapeButton
        .setX(index * ShapeSelector.buttonSize)
        .setY(ShapeSelector.buttonSize / 2 + 20)
        .onClick(() => selectedIdx.value = index);
      return shapeButton;
    });

    this.add(buttons);
    this.setX(ShapeSelector.buttonSize / 2);
  }
}
