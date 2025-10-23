import { Injectable, signal } from '@angular/core';
import { SLIDES_SPEED } from '../constants/slides-speed';

@Injectable()
export class SlideshowService {
  slideshowSpeed = signal<number>(SLIDES_SPEED);
  slideshowActive = signal<boolean>(false);

  toggleSlideshow() {
    this.slideshowActive.update((v) => !v);
  }

  setSlideshowSpeed(ms: number) {
    this.slideshowSpeed.set(ms);
  }
}
