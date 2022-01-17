import Phaser from 'phaser';
import { Trackable } from 'reactive-observables';
import { PointInterface } from '@/models/point';
import { SizeInterface } from '@/models/size';
import { isTrackable, unwrapTrackable } from '@/utils/observables';

export class Rectangle extends Phaser.GameObjects.Rectangle {
  constructor(
    scene: Phaser.Scene,
    center: PointInterface | Trackable<PointInterface>,
    size: SizeInterface | Trackable<SizeInterface>,
    fillColor?: number | Trackable<number | undefined>,
    fillAlpha?: number | Trackable<number | undefined>,
    lineWidth?: number | Trackable<number | undefined>,
    strokeColor?: number | Trackable<number | undefined>,
    strokeAlpha?: number | Trackable<number | undefined>,
  ) {
    const { x, y } = unwrapTrackable(center);
    const { width, height } = unwrapTrackable(size);
    super(scene, x, y, width, height, unwrapTrackable(fillColor), unwrapTrackable(fillAlpha));
    this.setStrokeStyle(unwrapTrackable(lineWidth), unwrapTrackable(strokeColor), unwrapTrackable(strokeAlpha));

    if (isTrackable(center)) {
      center.subscribe(value => {
        this.setX(value.x);
        this.setY(value.y);
      });
    }

    if (isTrackable(size)) {
      size.subscribe(value => {
        this.width = value.width;
        this.height = value.height;
      });
    }

    if (isTrackable(fillColor)) {
      fillColor.subscribe(value => {
        this.setFillStyle(value, this.fillAlpha);
      });
    }

    if (isTrackable(fillAlpha)) {
      fillAlpha.subscribe(value => {
        this.setFillStyle(this.fillColor, value);
      });
    }

    if (isTrackable(lineWidth)) {
      lineWidth.subscribe(value => {
        this.setStrokeStyle(value, this.strokeColor, this.strokeAlpha);
      });
    }

    if (isTrackable(strokeColor)) {
      strokeColor.subscribe(value => {
        this.setStrokeStyle(this.lineWidth, value, this.strokeAlpha);
      });
    }

    if (isTrackable(strokeAlpha)) {
      strokeAlpha.subscribe(value => {
        this.setStrokeStyle(this.lineWidth, this.strokeColor, value);
      });
    }
  }
}
