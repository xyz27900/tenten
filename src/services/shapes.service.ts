import { TrackedArray, TrackedComputedSubject, TrackedSubject } from 'reactive-observables';
import { Provider } from '@/di/decorators';
import { Shape } from '@/models/shape';
import { SHAPES } from '@/shapes';
import { computed, trackable, trackableArray } from '@/utils/observables';

@Provider()
export class ShapesService {
  public readonly shapes: TrackedArray<Shape>;
  public readonly lockedShapes: TrackedArray<number>;
  public readonly selectedIdx: TrackedSubject<number | null>;
  public readonly selectedShape: TrackedComputedSubject<Shape | null>;

  constructor() {
    this.shapes = trackableArray([]);
    this.lockedShapes = trackableArray([]);
    this.selectedIdx = trackable(null);
    this.selectedShape = computed(() => {
      return this.selectedIdx.value !== null
        ? this.shapes.value[this.selectedIdx.value]
        : null;
    });

    this.lockedShapes.subscribe(this.handleLocked.bind(this));
    this.reset();
  }

  public get availableShapes(): Shape[] {
    return this.shapes.value.filter((_, index) => !this.lockedShapes.value.includes(index));
  }

  private handleLocked(value: number[]): void {
    if (value.length === 3) {
      this.reset();
    }
  }

  public reset(): void {
    this.selectedIdx.value = null;
    this.shapes.value = [...SHAPES].sort(() => .5 - Math.random()).slice(0, 3);
    this.lockedShapes.value = [];
  }

  public lockSelectedShape(): void {
    if (this.selectedIdx.value !== null) {
      this.lockedShapes.value = [...this.lockedShapes.value, this.selectedIdx.value];
      this.selectedIdx.value = null;
    }
  }
}
