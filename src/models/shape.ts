import { Rect } from '@/models/common';
import { Point } from '@/models/point';
import { Size } from '@/models/size';

interface ShapeInterface {
  color: number;
  points: Point[];
}

export class Shape implements ShapeInterface {
  public readonly color: number;
  public readonly points: Point[];

  constructor(color: number, ...points: Point[]) {
    this.color = color;
    this.points = points;
  }

  private get sortedX(): [Point, Point] {
    const sorted = [...this.points].sort((a, b) => a.x - b.x);
    return [sorted[0], sorted[sorted.length - 1]];
  }

  private get sortedY(): [Point, Point] {
    const sorted = [...this.points].sort((a, b) => a.y - b.y);
    return [sorted[0], sorted[sorted.length - 1]];
  }

  public get dimensions(): Size {
    const [left, right] = this.sortedX;
    const [top, bottom] = this.sortedY;
    const width = Math.abs(right.x - left.x) + 1;
    const height = Math.abs(bottom.y - top.y) + 1;
    return new Size(width, height);
  }

  public get edges(): Rect {
    const [left, right] = this.sortedX;
    const [top, bottom] = this.sortedY;

    return {
      top: Math.abs(top.y),
      bottom: 9 - Math.abs(bottom.y),
      left: Math.abs(left.x),
      right: 9 - Math.abs(right.x),
    };
  }

  public get center(): Point {
    return Point.from({
      x: this.dimensions.width / 2,
      y: this.dimensions.height / 2,
    });
  }

  public static from(object: ShapeInterface): Shape {
    return new Shape(object.color, ...object.points);
  }
}
