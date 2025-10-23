import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { QuotesService } from '../../services/quotes.service';
import { Quote } from '../../types/quote';
import { QuoteCardComponent } from '../../components/quote-card/quote-card';
import { SlideshowToggleComponent } from '../../components/slideshow-toggle/slideshow-toggle';
import { ApplicationModeService } from '@core/services/application-mode.service';
import { ShareService } from '@core/services/share.service';
import { Platform } from '@core/types/platform';
import { SlideshowService } from '@core/services/slideshow.service';
import { RatingService } from '@features/quotes/services/rating.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuoteCardComponent, SlideshowToggleComponent],
  providers: [SlideshowService],
})
export class QuotesComponent implements OnInit, OnDestroy {
  private readonly quotesService = inject(QuotesService);
  private readonly appModeService = inject(ApplicationModeService);
  private readonly slideshowService = inject(SlideshowService);
  private readonly ratingService = inject(RatingService);
  private readonly shareService = inject(ShareService);

  quote = signal<Quote | null>(null);
  isLoading = signal<boolean>(true);
  currentRating = signal<number | null>(null);
  isOnline = this.appModeService.isOnline;
  slideshowActive = this.slideshowService.slideshowActive;
  slideshowSpeed = this.slideshowService.slideshowSpeed;

  private _slideshowInterval: number | null = null;

  async fetchQuote(): Promise<Quote | void> {
    this.isLoading.set(true);
    try {
      const newQuote = await this.quotesService.getRandomQuote();
      this.quote.set(newQuote);
      const rating = this.ratingService.getRating(newQuote.text);
      this.currentRating.set(rating);
    } catch (err) {
      console.error('Failed to fetch quote:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  constructor() {
    effect(() => {
      const active = this.slideshowService.slideshowActive();
      const speed = this.slideshowService.slideshowSpeed();

      if (active) {
        if (this._slideshowInterval) clearInterval(this._slideshowInterval);
        this._slideshowInterval = setInterval(() => {
          this.fetchQuote();
        }, speed);
      } else {
        if (this._slideshowInterval) {
          clearInterval(this._slideshowInterval);
          this._slideshowInterval = null;
        }
      }
    });
  }

  ngOnInit(): void {
    this.fetchQuote();

    // online/offline listeners
    this.appModeService.setMode(navigator.onLine);
    window.addEventListener('online', this.appModeService.handleOnline);
    window.addEventListener('offline', this.appModeService.handleOffline);
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.appModeService.handleOnline);
    window.removeEventListener('offline', this.appModeService.handleOffline);
    if (this._slideshowInterval) clearInterval(this._slideshowInterval);
  }

  handleRate(rating: number): void {
    const q = this.quote();
    if (!q) return;
    this.ratingService.saveRating(q.text, rating);
    this.currentRating.set(rating);
  }

  handleShare(platform: Platform): void {
    const q = this.quote();
    if (!q) return;

    const text = `"${q.text}" — ${q.author}`;
    this.shareService.handleShare(text, platform);
  }

  toggleSlideshow(): void {
    this.slideshowService.toggleSlideshow();
  }

  setSlideshowSpeed(ms: number): void {
    this.slideshowService.setSlideshowSpeed(ms);
  }

  nextQuote(): void {
    this.fetchQuote();
  }
}
