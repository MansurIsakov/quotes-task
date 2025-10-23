import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationModeService {
  readonly isOnline = signal<boolean>(true);

  handleOnline = (): void => this.isOnline.set(true);
  handleOffline = (): void => this.isOnline.set(false);

  setMode(online: boolean): void {
    this.isOnline.set(online);
  }
}
