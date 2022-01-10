import Phaser from 'phaser';
import { Trackable } from 'reactive-observables';
import { ColorWithAlpha } from '@/models/common';
import { Point } from '@/models/point';
import { isTrackable, unwrapTrackable } from '@/utils/observables';

export type ElementColor = ColorWithAlpha | number;

export class Element extends Phaser.GameObjects.Rectangle {
  private readonly positionValue: Point | Trackable<Point>;
  private readonly size: number;

  constructor(
    scene: Phaser.Scene,
    position: Point | Trackable<Point>,
    color: ElementColor | Trackable<ElementColor>,
    size: number,
  ) {
    const { x, y } = Element.gridPositionToPoint(position, size);
    super(scene, x, y, size, size);
    this.positionValue = position;
    this.size = size;

    if (isTrackable(this.positionValue)) {
      this.positionValue.subscribe(this.updatePosition.bind(this));
    }

    if (isTrackable(color)) {
      color.subscribe(this.updateColor.bind(this));
      this.updateColor(color.value);
    } else {
      this.updateColor(color);
    }

    this.setStrokeStyle(2, 0xffffff);
  }

  public get position(): Point {
    return unwrapTrackable(this.positionValue);
  }

  private static gridPositionToPoint(position: Point | Trackable<Point>, size: number): Point {
    const positionValue = unwrapTrackable(position);
    return positionValue.mul(size).shift(size / 2);
  }

  private updatePosition(position: Point): void {
    const newPoint = Element.gridPositionToPoint(position, this.size);
    this.setX(newPoint.x);
    this.setY(newPoint.y);
  }

  private updateColor(color: ElementColor): void {
    if (typeof color === 'number') {
      this.setFillStyle(color, 1);
    } else {
      this.setFillStyle(color.color, color.alpha ?? 1);
    }
  }
}
