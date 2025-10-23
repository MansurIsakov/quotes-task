// src/app/services/rating.service.ts
export interface QuoteRating {
  text: string;
  rating: number; // 1-5
  timestamp: number;
}

const RATINGS_KEY = 'quote_ratings';

export function getRatings(): QuoteRating[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(RATINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveRating(quote: string, rating: number): void {
  if (typeof window === 'undefined') return;
  const ratings = getRatings();
  const idx = ratings.findIndex((r) => r.text === quote);
  const entry = { text: quote, rating, timestamp: Date.now() };
  if (idx >= 0) ratings[idx] = entry;
  else ratings.push(entry);
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
}

export function getRating(quote: string): number | null {
  const ratings = getRatings();
  const found = ratings.find((r) => r.text === quote);
  return found ? found.rating : null;
}
