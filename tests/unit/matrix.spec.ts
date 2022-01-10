import 'reflect-metadata';
import { expect } from 'chai';
import { Point } from '@/models/point';
import { MatrixService } from '@/services/matrix.service';
import { SHAPES } from '@/shapes';

describe('Testing matrix', (): void => {
  const matrixService = new MatrixService(0);

  beforeEach((): void => matrixService.reset());

  describe('Read and write operations', (): void => {
    it ('Should return cell value', (): void => {
      matrixService.setCell(0, 0, 1);
      expect(matrixService.getCell(0, 0)).to.equal(1);
    });

    it('Should set cell to value', (): void => {
      matrixService.setCell(0, 0, 1);
      expect(matrixService.values.value[0]).to.equal(1);
    });

    it('Should return cells', (): void => {
      matrixService.setCell(0, 0, 1);
      matrixService.setCell(0, 9, 1);
      matrixService.setCell(9, 0, 1);
      matrixService.setCell(9, 9, 1);

      expect(matrixService.cells[0]).to.equal(1);
      expect(matrixService.cells[9]).to.equal(1);
      expect(matrixService.cells[90]).to.equal(1);
      expect(matrixService.cells[99]).to.equal(1);
    });

    it('Should rewrite cells', (): void => {
      matrixService.cells = Array.from({ length: 100 }).map(() => 1);
      expect(matrixService.cells.every(cell => cell === 1)).to.be.true;
    });

    it('Should return empty cells positions', (): void => {
      matrixService.cells = Array.from({ length: 100 }).map(() => 1);
      matrixService.setCell(0, 0, null);
      matrixService.setCell(9, 9, null);

      const freePositions = [new Point(0, 0), new Point(9, 9)];
      expect(matrixService.freeCells).to.eql(freePositions);
    });
  });

  it('Should return rows', (): void => {
    matrixService.setCell(0, 0, 1);
    matrixService.setCell(0, 1, 1);
    matrixService.setCell(0, 2, 1);

    expect(matrixService.rows[0].values).to.eql([1, null, null, null, null, null, null, null, null, null]);
    expect(matrixService.rows[1].values).to.eql([1, null, null, null, null, null, null, null, null, null]);
    expect(matrixService.rows[2].values).to.eql([1, null, null, null, null, null, null, null, null, null]);
  });

  it('Should return columns', (): void => {
    matrixService.setCell(0, 0, 1);
    matrixService.setCell(1, 0, 1);
    matrixService.setCell(2, 0, 1);

    expect(matrixService.columns[0].values).to.eql([1, null, null, null, null, null, null, null, null, null]);
    expect(matrixService.columns[1].values).to.eql([1, null, null, null, null, null, null, null, null, null]);
    expect(matrixService.columns[2].values).to.eql([1, null, null, null, null, null, null, null, null, null]);
  });

  it('Should fill cells according to points', (): void => {
    const points = [new Point(0, 0), new Point(1, 0), new Point(1, 1)];
    matrixService.fillCells(points, 1);

    expect(matrixService.getCell(0, 0)).to.equal(1);
    expect(matrixService.getCell(1, 0)).to.equal(1);
    expect(matrixService.getCell(1, 1)).to.equal(1);
  });

  it('Should detect collision', (): void => {
    const filledPoints = [new Point(0, 0), new Point(1, 0), new Point(1, 1)];
    matrixService.fillCells(filledPoints, 1);

    const points1 = [new Point(0, 1), new Point(0, 2), new Point(1, 2)];
    const points2 = [new Point(0, 1), new Point(1, 1), new Point(1, 2)];

    expect(matrixService.hasCollisions(points1)).to.be.false;
    expect(matrixService.hasCollisions(points2)).to.be.true;
  });

  describe('Should detect if shape can be placed into matrix', (): void => {
    it('1x1', (): void => {
      const shape = SHAPES[0];
      expect(matrixService.canInsert(shape)).to.be.true;
      matrixService.cells = Array.from({ length: 100 }).map(() => 1);
      expect(matrixService.canInsert(shape)).to.be.false;
      matrixService.setCell(9, 9, null);
      expect(matrixService.canInsert(shape)).to.be.true;
    });

    it('2x2', (): void => {
      const shape = SHAPES[1];
      expect(matrixService.canInsert(shape)).to.be.true;
      matrixService.cells = Array.from({ length: 100 }).map(() => 1);
      expect(matrixService.canInsert(shape)).to.be.false;
      matrixService.setCell(8, 8, null);
      expect(matrixService.canInsert(shape)).to.be.false;
      matrixService.setCell(8, 9, null);
      matrixService.setCell(9, 8, null);
      matrixService.setCell(9, 9, null);
      expect(matrixService.canInsert(shape)).to.be.true;
    });
  });

  it('Should reset matrix', (): void => {
    matrixService.setCell(0, 0, 1);
    matrixService.setCell(9, 9, 1);
    matrixService.reset();

    expect(matrixService.cells.every(cell => cell === null)).to.be.true;
  });
});
