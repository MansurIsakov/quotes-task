import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Quote } from '../../types/quote';
import { LucideAngularModule, HeartIcon, LucideLoader, Twitter, Facebook } from 'lucide-angular';
import { Platform } from '@core/types/platform';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-quote-card',
  templateUrl: './quote-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, NgClass],
})
export class QuoteCardComponent {
  @Input() quote!: Quote;
  @Input() isLoading = false;
  @Input() currentRating: number | null = null;

  @Output() next = new EventEmitter<void>();
  @Output() rate = new EventEmitter<number>();
  @Output() share = new EventEmitter<Platform>();

  showRating = false;
  icons = {
    Heart: HeartIcon,
    LucideLoader: LucideLoader,
    Twitter: Twitter,
    Facebook: Facebook,
  };

  onRate(r: number) {
    this.rate.emit(r);
    this.showRating = false;
  }

  onShare(platform: 'twitter' | 'facebook') {
    this.share.emit(platform);
  }
}
