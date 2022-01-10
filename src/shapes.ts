import { Point } from '@/models/point';
import { Shape } from '@/models/shape';
import { COLORS } from '@/vars/colors';

export const SHAPES: Shape[] = [
  /* 1x1 */
  new Shape(
    COLORS.VIOLET,
    new Point(0, 0),
  ),
  /* 2x2 */
  new Shape(
    COLORS.LIME,
    new Point(0, 0),
    new Point(1, 0),
    new Point(0, -1),
    new Point(1, -1),
  ),
  /* 3x3 Square */
  new Shape(
    COLORS.TEAL,
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
    new Point(0, -1),
    new Point(1, -1),
    new Point(2, -1),
    new Point(0, -2),
    new Point(1, -2),
    new Point(2, -2),
  ),
  /* 2x1 */
  new Shape(
    COLORS.YELLOW,
    new Point(0, 0),
    new Point(1, 0),
  ),
  /* 1x2 */
  new Shape(
    COLORS.YELLOW,
    new Point(0, 0),
    new Point(0, -1),
  ),
  /* 3x1 */
  new Shape(
    COLORS.ORANGE,
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
  ),
  /* 1x3 */
  new Shape(
    COLORS.ORANGE,
    new Point(0, 0),
    new Point(0, -1),
    new Point(0, -2),
  ),
  /* 4x1 */
  new Shape(
    COLORS.PURPLE,
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
    new Point(3, 0),
  ),
  /* 1x4 */
  new Shape(
    COLORS.PURPLE,
    new Point(0, 0),
    new Point(0, -1),
    new Point(0, -2),
    new Point(0, -3),
  ),
  /* 5x1 */
  new Shape(
    COLORS.RED,
    new Point(-1, 0),
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
    new Point(3, 0),
  ),
  /* 1x5 */
  new Shape(
    COLORS.RED,
    new Point(0, 0),
    new Point(0, -1),
    new Point(0, -2),
    new Point(0, -3),
    new Point(0, -4),
  ),
  /* 2x2 L */
  new Shape(
    COLORS.GREEN,
    new Point(0, 0),
    new Point(0, -1),
    new Point(1, -1),
  ),
  new Shape(
    COLORS.GREEN,
    new Point(0, -1),
    new Point(1, -1),
    new Point(1, 0),
  ),
  new Shape(
    COLORS.GREEN,
    new Point(0, 0),
    new Point(1, 0),
    new Point(1, -1),
  ),
  new Shape(
    COLORS.GREEN,
    new Point(0, 0),
    new Point(1, 0),
    new Point(0, -1),
  ),
  /* 3x3 L */
  new Shape(
    COLORS.BLUE,
    new Point(0, 0),
    new Point(0, -1),
    new Point(0, -2),
    new Point(1, -2),
    new Point(2, -2),
  ),
  new Shape(
    COLORS.BLUE,
    new Point(0, -2),
    new Point(1, -2),
    new Point(2, -2),
    new Point(2, -1),
    new Point(2, 0),
  ),
  new Shape(
    COLORS.BLUE,
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
    new Point(2, -1),
    new Point(2, -2),
  ),
  new Shape(
    COLORS.BLUE,
    new Point(0, 0),
    new Point(1, 0),
    new Point(2, 0),
    new Point(0, -1),
    new Point(0, -2),
  ),
];
