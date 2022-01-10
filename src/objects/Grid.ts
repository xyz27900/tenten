import Phaser from 'phaser';
import { FIELD_SIZE, TILE_SIZE } from '@/config';
import { COLORS } from '@/vars/colors';

export class Grid extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly lines: Phaser.GameObjects.Rectangle[];

  constructor(scene: Phaser.Scene) {
    super(scene, FIELD_SIZE / 2, FIELD_SIZE / 2);
    this.background = this.createBackground();
    this.lines = this.createLines();
    this.add(this.children);
  }

  private get children(): Phaser.GameObjects.GameObject[] {
    return [this.background, ...this.lines];
  }

  private createBackground(): Phaser.GameObjects.Rectangle {
    return new Phaser.GameObjects.Rectangle(this.scene, 0, 0, FIELD_SIZE, FIELD_SIZE, COLORS.GRAY);
  }

  private createLines(): Phaser.GameObjects.Rectangle[] {
    const vertical = Array.from({ length: 11 }).map((_, index) => {
      return this.createVerticalLine(TILE_SIZE * index - FIELD_SIZE / 2);
    });

    const horizontal = Array.from({ length: 11 }).map((_, index) => {
      return this.createHorizontalLine(TILE_SIZE * index - FIELD_SIZE / 2);
    });

    return [...vertical, ...horizontal];
  }

  private createVerticalLine(x: number): Phaser.GameObjects.Rectangle {
    return new Phaser.GameObjects.Rectangle(this.scene, x, 0, 2, FIELD_SIZE, COLORS.WHITE);
  }

  private createHorizontalLine(y: number): Phaser.GameObjects.Rectangle {
    return new Phaser.GameObjects.Rectangle(this.scene, 0, y, FIELD_SIZE, 2, COLORS.WHITE);
  }
}
