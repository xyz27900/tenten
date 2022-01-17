import { TrackedArray } from 'reactive-observables';
import { Provider } from '@/di/decorators';
import { Point } from '@/models/point';
import { Shape } from '@/models/shape';
import { trackableArray } from '@/utils/observables';

type MatrixValue = number | null;

@Provider()
export class MatrixService {
  public readonly values: TrackedArray<MatrixValue>;
  public clearDelay: number;

  constructor() {
    this.values = trackableArray(Array.from({ length: 100 }).map(() => null));
    this.clearDelay = 20;
  }

  private static notNull<T>(value: T | null): value is T {
    return value !== null;
  }

  public get freeCells(): Point[] {
    return this.cells
      .map((value, index) => {
        if (value === null) {
          const x = index % 10;
          const y = (index - x) / 10;
          return Point.from({ x, y });
        } else {
          return null;
        }
      })
      .filter(MatrixService.notNull);
  }

  public get cells(): MatrixValue[] {
    return this.values.value;
  }

  public set cells(cells: MatrixValue[]) {
    this.values.value = cells;
  }

  public get rows(): MatrixRow[] {
    return Array
      .from({ length: 10 })
      .map((_, index) => new MatrixRow(this, index));
  }

  public get columns(): MatrixColumn[] {
    return Array
      .from({ length: 10 })
      .map((_, index) => new MatrixColumn(this, index));
  }

  public setDelay(delay: number): void {
    this.clearDelay = delay;
  }

  public getCell(x: number, y: number): MatrixValue {
    return this.cells[y * 10 + x];
  }

  public setCell(x: number, y: number, value: MatrixValue): void {
    const clone = [...this.cells];
    clone[y * 10 + x] = value;
    this.cells = clone;
  }

  public fillCells(positions: Point[], value: number): void {
    positions.forEach(position => this.setCell(position.x, position.y, value));
  }

  public hasCollisions(positions: Point[]): boolean {
    return positions.some(position => this.getCell(position.x, position.y) !== null);
  }

  public canInsert(shape: Shape): boolean {
    for (let i = shape.edges.top; i < shape.edges.bottom + 1; i++) {
      for (let j = shape.edges.left; j < shape.edges.right + 1; j++) {
        const hasPlace = shape.points
          .map(position => position.shift(j, i))
          .every(position => this.freeCells.find(cell => cell.isEqualTo(position)));
        if (hasPlace) {
          return true;
        }
      }
    }
    return false;
  }

  public subscribe(fn: (value: MatrixValue[]) => void): void {
    this.values.subscribe(fn);
  }

  public reset(): void {
    this.cells = Array.from({ length: 100 }).map(() => null);
  }
}

abstract class MatrixItem {
  protected readonly matrix: MatrixService;
  public readonly index: number;

  constructor(matrix: MatrixService, index: number) {
    this.matrix = matrix;
    this.index = index;
  }

  public get isFull(): boolean {
    return this.values.every(value => value !== null);
  }

  public abstract get values(): MatrixValue[]
}

class MatrixRow extends MatrixItem {
  public get values(): MatrixValue[] {
    return this.matrix.cells.slice(10 * this.index, 10 * this.index + 10);
  }
}

class MatrixColumn extends MatrixItem {
  public get values(): MatrixValue[] {
    return Array.from({ length: 10 }).map((_, index) => {
      return this.matrix.getCell(this.index, index);
    });
  }
}
