import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { slideshowOptions } from '@core/configs/slideshow-options';

@Component({
  selector: 'app-slideshow-toggle',
  standalone: true,
  templateUrl: './slideshow-toggle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideshowToggleComponent {
  readonly isActive = input.required<boolean>();
  readonly speed = input.required<number>();

  readonly toggleSlide = output<void>();
  readonly speedChange = output<number>();

  slideshowOptions = slideshowOptions;
}
