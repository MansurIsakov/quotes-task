import { Injectable } from '@angular/core';
import { QuoteRating } from '../types/quote-rating';

const RATINGS_KEY = 'quote_ratings';

@Injectable({ providedIn: 'root' })
export class RatingService {
  getRatings(): QuoteRating[] {
    if (typeof window === 'undefined') return [];

    const raw = localStorage.getItem(RATINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  saveRating(quote: string, rating: number): void {
    if (typeof window === 'undefined') return;

    const ratings = this.getRatings();
    const idx = ratings.findIndex((r) => r.text === quote);
    const entry = { text: quote, rating, timestamp: Date.now() };
    if (idx >= 0) ratings[idx] = entry;
    else ratings.push(entry);
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  }

  getRating(quote: string): number | null {
    const ratings = this.getRatings();
    const found = ratings.find((r) => r.text === quote);
    return found ? found.rating : null;
  }
}
