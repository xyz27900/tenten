import Phaser from 'phaser';
import { TrackedSubject } from 'reactive-observables';
import { FIELD_SIZE, SOUND_CLICK, SOUND_SUCCESS, TILE_SIZE } from '@/config';
import { Injectable, UseScene } from '@/di/decorators';
import { Rectangle } from '@/helpers/Rectangle';
import { Point } from '@/models/point';
import { Shape } from '@/models/shape';
import { Size } from '@/models/size';
import { ShapeContainer } from '@/objects/ShapeContainer';
import { MatrixService } from '@/services/matrix.service';
import { ScoreService } from '@/services/score.service';
import { ShapesService } from '@/services/shapes.service';
import { StateService } from '@/services/state.service';
import { trackable } from '@/utils/observables';
import { promiseTimeout } from '@/utils/timeout';

@Injectable()
export class DrawingLayer extends Phaser.GameObjects.Container {
  private readonly stateService: StateService;
  private readonly shapesService: ShapesService;
  private readonly matrixService: MatrixService;
  private readonly scoreService: ScoreService;

  private readonly pointerPosition: TrackedSubject<Point> = trackable(Point.origin());
  private readonly isShapeContainerVisible: TrackedSubject<boolean> = trackable(false);
  private readonly isShapeContainerError: TrackedSubject<boolean> = trackable(false);
  private readonly hitArea: Phaser.GameObjects.Rectangle;

  private shapeContainer: ShapeContainer | null = null;

  constructor(@UseScene() scene: Phaser.Scene, stateService: StateService, shapesService: ShapesService, matrixService: MatrixService, scoreService: ScoreService) {
    super(scene, FIELD_SIZE / 2, FIELD_SIZE / 2);
    this.stateService = stateService;
    this.shapesService = shapesService;
    this.matrixService = matrixService;
    this.scoreService = scoreService;
    this.hitArea = this.createHitArea();

    this.shapesService.selectedShape.subscribe(this.updateShape.bind(this));
    this.updateShape(this.shapesService.selectedShape.value);

    this.hitArea.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleClick.bind(this))
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, this.handleMove.bind(this))
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.handleOver.bind(this))
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handleOut.bind(this));

    this.add(this.hitArea);
  }

  /* Associate pointer position with the matrix cell */
  private static getGridPosition(pointer: Phaser.Input.Pointer): Point {
    return Point.from(pointer).div(TILE_SIZE);
  }

  /* Creation helpers */
  private createHitArea(): Phaser.GameObjects.Rectangle {
    return new Rectangle(this.scene, Point.origin(), Size.square(FIELD_SIZE));
  }

  private createShapeContainer(shape: Shape): ShapeContainer {
    return new ShapeContainer(
      this.scene,
      shape,
      this.pointerPosition,
      this.isShapeContainerVisible,
      this.isShapeContainerError,
    );
  }

  /* Updaters */
  private updateShape(shape: Shape | null): void {
    if (this.shapeContainer) {
      this.remove(this.shapeContainer, true);
    }

    if (shape) {
      this.shapeContainer = this.createShapeContainer(shape);
      this.add(this.shapeContainer);
    } else {
      this.shapeContainer = null;
    }
  }

  /* Handlers */
  private async handleClick(): Promise<void> {
    const shapeContainer = this.shapeContainer;
    const selectedShape = this.shapesService.selectedShape.value;

    if (!shapeContainer || !selectedShape) {
      return;
    }

    const positions = shapeContainer.getPositions();
    if (this.matrixService.hasCollisions(positions)) {
      return;
    }

    this.matrixService.fillCells(positions, selectedShape.color);
    this.scoreService.increase(selectedShape.points.length);
    this.shapesService.lockSelectedShape();

    let clearTimeouts = this.matrixService.rows
      .filter(row => row.isFull)
      .map(row => {
        return row.values.map((_, index) => {
          return promiseTimeout(() => {
            this.matrixService.setCell(index, row.index, null);
          }, index * this.matrixService.clearDelay);
        });
      })
      .flat();

    if (clearTimeouts.length === 0) {
      clearTimeouts = this.matrixService.columns
        .filter(column => column.isFull)
        .map(column => {
          return column.values.map((_, index) => {
            return promiseTimeout(() => {
              this.matrixService.setCell(column.index, index, null);
            }, index * this.matrixService.clearDelay);
          });
        })
        .flat();
    }

    this.scoreService.increase(clearTimeouts.length);
    this.scene.sound.get(clearTimeouts.length > 0 ? SOUND_SUCCESS : SOUND_CLICK).play();
    await Promise.all(clearTimeouts);

    const gameOver = this.shapesService.availableShapes.every(shape => !this.matrixService.canInsert(shape));
    if (gameOver) {
      this.stateService.gameOver();
    }
  }

  private handleMove(pointer: Phaser.Input.Pointer): void {
    if (!this.shapeContainer || !this.shapesService.selectedShape.value) {
      return;
    }

    const point = DrawingLayer.getGridPosition(pointer);
    const box = this.shapeContainer.getBox();
    const edges = this.shapesService.selectedShape.value.edges;
    const getDx = (): number => point.x - this.pointerPosition.value.x;
    const getDy = (): number => point.y - this.pointerPosition.value.y;

    /* Modify Y to align shape container with edge */
    if (box.top + getDy() <= 0) {
      point.y = edges.top;
    } else if (box.bottom + getDy() >= 9) {
      point.y = edges.bottom;
    }

    /* Modify X to align shape container with edge */
    if (box.left + getDx() <= 0) {
      point.x = edges.left;
    } else if (box.right + getDx() >= 9) {
      point.x = edges.right;
    }

    /* Calculate probable positions if shape container will be placed right now */
    const probablePositions = this.shapeContainer
      .getPositions()
      .map(position => {
        return position.shift(getDx(), getDy());
      });

    this.isShapeContainerError.value = this.matrixService.hasCollisions(probablePositions);
    this.pointerPosition.value = point;
  }

  private handleOver(): void {
    this.isShapeContainerVisible.value = true;
  }

  private handleOut(): void {
    this.isShapeContainerVisible.value = false;
  }
}
