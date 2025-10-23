import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Quote } from '../../types/quote';
import { LucideAngularModule, HeartIcon } from 'lucide-angular';

@Component({
  selector: 'app-quote-card',
  templateUrl: './quote-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
})
export class QuoteCardComponent {
  @Input() quote!: Quote;
  @Input() isLoading = false;
  @Input() currentRating: number | null = null;

  @Output() next = new EventEmitter<void>();
  @Output() rate = new EventEmitter<number>();
  @Output() share = new EventEmitter<'twitter' | 'facebook'>();

  showRating = false;
  HeartIcon = HeartIcon;

  onRate(r: number) {
    this.rate.emit(r);
    this.showRating = false;
  }

  onShare(platform: 'twitter' | 'facebook') {
    this.share.emit(platform);
  }
}
