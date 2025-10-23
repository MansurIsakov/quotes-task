import { Injectable, signal } from '@angular/core';
import { SLIDES_SPEED } from '../constants/slides-speed';

@Injectable()
export class SlideshowService {
  readonly slideshowSpeed = signal<number>(SLIDES_SPEED);
  readonly slideshowActive = signal<boolean>(false);

  toggleSlideshow(): void {
    this.slideshowActive.update((v) => !v);
  }

  setSlideshowSpeed(ms: number): void {
    this.slideshowSpeed.set(ms);
  }
}
