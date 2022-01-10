import Phaser from 'phaser';
import { Trackable, TrackedComputedSubject } from 'reactive-observables';
import { FIELD_SIZE, TILE_SIZE } from '@/config';
import { Rect } from '@/models/common';
import { Point } from '@/models/point';
import { Shape } from '@/models/shape';
import { Element, ElementColor } from '@/objects/Element';
import { COLORS } from '@/vars/colors';

export class ShapeContainer extends Phaser.GameObjects.Container {
  private readonly shape: Shape;
  private readonly reference: Trackable<Point>;
  private readonly color: Trackable<ElementColor>;
  private readonly elements: Element[];

  constructor(
    scene: Phaser.Scene,
    shape: Shape,
    reference: Trackable<Point>,
    visible: Trackable<boolean>,
    error: Trackable<boolean>,
  ) {
    super(scene);
    this.shape = shape;
    this.reference = reference;
    this.color = this.createComputedColor(error);
    this.elements = this.createElements();
    this.add(this.elements);
    visible.subscribe(this.updateVisibility.bind(this));
    this.updateVisibility(visible.value);
    this.setX(-1 * FIELD_SIZE / 2).setY(-1 * FIELD_SIZE / 2);
  }

  private createComputedColor(error: Trackable<boolean>): TrackedComputedSubject<ElementColor> {
    return new TrackedComputedSubject(() => {
      return error.value
        ? { color: COLORS.BLACK, alpha: .5 }
        : this.shape.color;
    });
  }

  private createComputedPoint(point: Point): TrackedComputedSubject<Point> {
    return new TrackedComputedSubject(() => {
      return this.reference.value.shift(point.x, point.y);
    });
  }

  private createElements(): Element[] {
    return this.shape.points.map(point => {
      const elementPoint = this.createComputedPoint(point);
      return new Element(this.scene, elementPoint, this.color, TILE_SIZE);
    });
  }

  private updateVisibility(visible: boolean): void {
    this.setVisible(visible);
  }

  public getBox(): Rect {
    const sortedY = [...this.getPositions()].sort((a, b) => a.y - b.y);
    const sortedX = [...this.getPositions()].sort((a, b) => a.x - b.x);

    return {
      top: sortedY[0].y,
      bottom: sortedY[sortedY.length - 1].y,
      left: sortedX[0].x,
      right: sortedX[sortedX.length - 1].x,
    };
  }

  public getPositions(): Point[] {
    return this.elements.map(element => element.position);
  }
}
