import { TrackedSubject } from 'reactive-observables';
import { Provider } from '@/di/decorators';
import { trackable } from '@/utils/observables';

@Provider()
export class StateService {
  public readonly isOver: TrackedSubject<boolean>;

  constructor() {
    this.isOver = trackable(false);
  }

  public gameOver(): void {
    this.isOver.value = true;
  }

  public reset(): void {
    this.isOver.value = false;
  }
}
