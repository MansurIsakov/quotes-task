import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationModeService {
  isOnline = signal<boolean>(true);

  handleOnline = () => this.isOnline.set(true);
  handleOffline = () => this.isOnline.set(false);

  setMode(online: boolean) {
    this.isOnline.set(online);
  }
}
