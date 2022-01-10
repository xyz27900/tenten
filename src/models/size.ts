export interface SizeInterface {
  readonly width: number;
  readonly height: number;
}

export class Size implements SizeInterface {
  public readonly width: number;
  public readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public static square(size: number): Size {
    return new Size(size, size);
  }
}
