import Phaser from 'phaser';
import { inject, injectable } from 'tsyringe';
import { TILE_SIZE } from '@/config';
import { Point } from '@/models/point';
import { Element } from '@/objects/Element';
import { MatrixService } from '@/services/matrix.service';

@injectable()
export class ObjectsLayer extends Phaser.GameObjects.Container {
  private readonly matrixService: MatrixService;

  constructor(@inject('Scene') scene: Phaser.Scene, @inject(MatrixService) matrixService: MatrixService) {
    super(scene);
    this.matrixService = matrixService;
    this.matrixService.subscribe(this.updateElements.bind(this));
  }

  private createElement(point: Point, color: number): Element {
    return new Element(this.scene, point, color, TILE_SIZE);
  }

  private updateElements(matrix: (number | null)[]): void {
    this.removeAll(true);

    matrix.forEach((item, index) => {
      if (item === null) {
        return;
      }

      const x = index % 10;
      const y = (index - x) / 10;
      const point = Point.from({ x, y });

      const element = this.createElement(point, item);
      this.add(element);
    });
  }
}
