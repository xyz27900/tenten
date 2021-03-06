import Phaser from 'phaser';
import { FIELD_SIZE } from '@/config';
import { container } from '@/di/container';
import { Main } from '@/scenes/Main';

export class Game {
  public readonly game: Phaser.Game;

  constructor(parent: HTMLElement) {
    const main = container.resolve(Main);
    this.game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent,
      width: FIELD_SIZE,
      backgroundColor: 0xffffff,
      height: parent.offsetHeight,
      scene: [main],
    });
  }
}
