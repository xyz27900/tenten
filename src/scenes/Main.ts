import Phaser from 'phaser';
import { container, inject, injectable } from 'tsyringe';
import SoundClick from '@/assets/sounds/click.mp3';
import SoundSuccess from '@/assets/sounds/success.mp3';
import { FIELD_SIZE, SOUND_CLICK, SOUND_SUCCESS } from '@/config';
import { DrawingLayer } from '@/containers/DrawingLayer';
import { ObjectsLayer } from '@/containers/ObjectsLayer';
import { ShapeSelector } from '@/containers/ShapeSelector';
import { Grid } from '@/objects/Grid';
import { ShapesService } from '@/services/shapes.service';

@injectable()
export class Main extends Phaser.Scene {
  private readonly shapesService: ShapesService;

  constructor(@inject(ShapesService) shapesService: ShapesService) {
    super('Board');
    container.register('Scene', { useValue: this });
    this.shapesService = shapesService;
  }

  public preload(): void {
    this.load.audio(SOUND_CLICK, SoundClick);
    this.load.audio(SOUND_SUCCESS, SoundSuccess);
  }

  public create(): void {
    this.sound.add(SOUND_CLICK);
    this.sound.add(SOUND_SUCCESS);

    const grid = new Grid(this);
    const objectsLayer = container.resolve(ObjectsLayer);
    const drawingLayer = container.resolve(DrawingLayer);
    const shapeSelector = container.resolve(ShapeSelector);

    this.add.existing(grid);
    this.add.existing(objectsLayer).setDepth(0);
    this.add.existing(drawingLayer).setDepth(1);
    this.add.existing(shapeSelector).setY(FIELD_SIZE);
  }
}
