export interface PointInterface {
  x: number;
  y: number;
}

export class Point implements PointInterface {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static origin(): Point {
    return new Point(0, 0);
  }

  public static from(object: PointInterface): Point {
    return new Point(object.x, object.y);
  }

  public isEqualTo(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  public shift(x: number, y?: number): Point {
    return new Point(this.x + x, this.y + (y ?? x));
  }

  public mul(x: number, y?: number): Point {
    return new Point(this.x * x, this.y * (y ?? x));
  }

  public div(number: number): Point {
    return new Point(Math.floor(this.x / number), Math.floor(this.y / number));
  }
}
