import Phaser from 'phaser';
import { Trackable, TrackedComputedSubject, TrackedSubject } from 'reactive-observables';
import { Point } from '@/models/point';
import { Shape } from '@/models/shape';
import { Size } from '@/models/size';
import { Element } from '@/objects/Element';
import { ExtendedRectangle } from '@/objects/extended/Rectangle';
import { computed } from '@/utils/observables';
import { COLORS } from '@/vars/colors';

export class ShapeButton extends Phaser.GameObjects.Container {
  private readonly shape: Trackable<Shape>;
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly border: Phaser.GameObjects.Rectangle;

  private readonly disabled: Trackable<boolean>;
  private readonly selected: Trackable<boolean>;
  private readonly hovered: TrackedSubject<boolean>;

  private readonly backgroundColor: TrackedComputedSubject<number>;
  private readonly borderAlpha: TrackedComputedSubject<number>;

  private shapeContainer: Phaser.GameObjects.Container;
  private listener: (() => void) | null;

  constructor(
    scene: Phaser.Scene,
    shape: Trackable<Shape>,
    selected: Trackable<boolean>,
    disabled: Trackable<boolean>,
    size: number,
  ) {
    super(scene);
    this.shape = shape;

    this.disabled = disabled;
    this.selected = selected;
    this.hovered = new TrackedSubject(false);

    this.backgroundColor = this.createComputedBackgroundColor();
    this.borderAlpha = this.createComputedBorderAlpha();

    this.background = this.createBackground(size);
    this.border = this.createBorder(size, 2);

    this.shapeContainer = this.createShapeContainer(this.shape.value);
    this.listener = null;
    this.add([this.background, this.border, this.shapeContainer]);

    this.shape.subscribe(this.updateShapeContainer.bind(this));
    this.disabled.subscribe(this.updateInteractive.bind(this));
    this.disabled.subscribe(this.updateVisibility.bind(this));

    this.updateInteractive(this.disabled.value);
  }

  /* Creation helpers */
  private createBackground(size: number): Phaser.GameObjects.Rectangle {
    return new ExtendedRectangle(this.scene, Point.origin(), Size.square(size), this.backgroundColor, .1);
  }

  private createBorder(size: number, width: number): Phaser.GameObjects.Rectangle {
    return new ExtendedRectangle(this.scene, Point.origin(), Size.square(size - width), COLORS.WHITE, 0, width, COLORS.TEAL, this.borderAlpha);
  }

  private createShapeContainer(shape: Shape): Phaser.GameObjects.Container {
    const container = new Phaser.GameObjects.Container(this.scene);
    const reference = shape.center.mul(-1, 1).shift(shape.edges.left, -1);
    const elements = shape.points.map(point => {
      const elementPoint = reference.shift(point.x, point.y);
      return new Element(this.scene, elementPoint, shape.color, 16);
    });
    container.add(elements);
    return container;
  }

  private createComputedBackgroundColor(): TrackedComputedSubject<number> {
    return computed(() => {
      return !this.disabled.value && (this.selected.value || this.hovered.value) ? COLORS.TEAL : COLORS.WHITE;
    });
  }

  private createComputedBorderAlpha(): TrackedComputedSubject<number> {
    return computed(() => {
      return !this.disabled.value && this.selected.value ? 1 : 0;
    });
  }

  /* Updaters */
  private updateShapeContainer(shape: Shape): void {
    this.remove(this.shapeContainer, true);
    this.shapeContainer = this.createShapeContainer(shape);
    this.add(this.shapeContainer);
  }

  private updateInteractive(disabled: boolean): void {
    if (!disabled) {
      this.background.setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleClick.bind(this))
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.handleOver.bind(this))
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handleOut.bind(this));
    } else {
      this.background.removeInteractive();
    }
  }

  private updateVisibility(disabled: boolean): void {
    this.setVisible(!disabled);
  }

  /* Handlers */
  private handleClick(): void {
    if (this.listener) {
      this.listener();
    }
  }

  private handleOver(): void {
    if (!this.disabled.value) {
      this.hovered.value = true;
    }
  }

  private handleOut(): void {
    if (!this.disabled.value) {
      this.hovered.value = false;
    }
  }

  public onClick(fn: () => void): ShapeButton {
    this.listener = fn;
    return this;
  }
}
