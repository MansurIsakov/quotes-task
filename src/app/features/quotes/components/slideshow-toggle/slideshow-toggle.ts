import { Component, input, output } from '@angular/core';
import { slideshowOptions } from '@core/configs/slideshow-options';

@Component({
  selector: 'app-slideshow-toggle',
  standalone: true,
  templateUrl: './slideshow-toggle.html',
})
export class SlideshowToggleComponent {
  isActive = input.required<boolean>();
  speed = input.required<number>();

  toggle = output<void>();
  speedChange = output<number>();

  slideshowOptions = slideshowOptions;
}
