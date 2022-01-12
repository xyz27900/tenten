import { TrackedSubject } from 'reactive-observables';
import { inject, singleton } from 'tsyringe';
import { SCORE_STORAGE_KEY } from '@/config';
import { StorageService } from '@/services/storage.service';
import { trackable } from '@/utils/observables';

@singleton()
export class ScoreService {
  private readonly storageService: StorageService;

  public readonly current: TrackedSubject<number>;
  public readonly highest: TrackedSubject<number>;

  constructor(@inject(StorageService) storageService: StorageService) {
    this.storageService = storageService;
    this.current = trackable(0);
    this.highest = trackable(this.loadFromStorage());
  }

  private loadFromStorage(): number {
    const record = this.storageService.read(SCORE_STORAGE_KEY);
    const score = Number(record);
    return isNaN(score) ? 0 : score;
  }

  public increase(score: number): void {
    this.current.value += score;

    if (this.current.value > this.highest.value) {
      this.highest.value = this.current.value;
      this.storageService.write(SCORE_STORAGE_KEY, `${this.highest.value}`);
    }
  }

  public reset(): void {
    this.current.value = 0;
  }
}
