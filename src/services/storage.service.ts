import { injectable } from 'tsyringe';

@injectable()
export class StorageService {
  public read(path: string): string | null {
    return localStorage.getItem(path) ?? null;
  }

  public write(path: string, value: string): void {
    localStorage.setItem(path, value);
  }
}
