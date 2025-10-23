import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Quote } from '../../types/quote';
import { Facebook, HeartIcon, LucideAngularModule, LucideLoader, Twitter } from 'lucide-angular';
import { Platform } from '@core/types/platform';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-quote-card',
  templateUrl: './quote-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, NgClass],
})
export class QuoteCardComponent {
  readonly quoteInput = input.required<Quote>();
  readonly isLoading = input(false);
  readonly currentRating = input<number | null>(null);

  readonly rateQuote = output<number>();
  readonly nextQuote = output<void>();
  readonly shareQuote = output<Platform>();

  showRating = false;
  icons = {
    Heart: HeartIcon,
    LucideLoader: LucideLoader,
    Twitter: Twitter,
    Facebook: Facebook,
  };

  onRate(r: number): void {
    this.rateQuote.emit(r);
    this.showRating = false;
  }

  onShare(platform: 'twitter' | 'facebook'): void {
    this.shareQuote.emit(platform);
  }
}
