import SoundClick from '@/assets/sounds/click.mp3';
import SoundSuccess from '@/assets/sounds/success.mp3';
import { FIELD_SIZE, SOUND_CLICK, SOUND_SUCCESS } from '@/config';
import { DrawingLayer } from '@/containers/DrawingLayer';
import { ObjectsLayer } from '@/containers/ObjectsLayer';
import { ShapeSelector } from '@/containers/ShapeSelector';
import { Injectable } from '@/di/decorators';
import { Scene } from '@/helpers/scene';
import { Grid } from '@/objects/Grid';

@Injectable()
export class Main extends Scene {
  constructor() {
    super('Board');
  }

  public preload(): void {
    this.load.audio(SOUND_CLICK, SoundClick);
    this.load.audio(SOUND_SUCCESS, SoundSuccess);
  }

  public create(): void {
    this.sound.add(SOUND_CLICK);
    this.sound.add(SOUND_SUCCESS);

    const grid = new Grid(this);
    const objectsLayer = this.getComponent(ObjectsLayer);
    const drawingLayer = this.getComponent(DrawingLayer);
    const shapeSelector = this.getComponent(ShapeSelector);

    this.add.existing(grid);
    this.add.existing(objectsLayer).setDepth(0);
    this.add.existing(drawingLayer).setDepth(1);
    this.add.existing(shapeSelector).setY(FIELD_SIZE);
  }
}
