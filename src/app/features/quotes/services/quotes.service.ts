import { Injectable } from '@angular/core';
import { Quote } from '../types/quote';
import { DUMMY_QUOTES } from '../data/dummy-quotes';
import { CACHE_DURATION } from '@core/constants/cache-duration';

const QUOTE_CACHE_KEY = 'quote_cache';
const CACHE_EXPIRY_KEY = 'quote_cache_expiry';

const API_ENDPOINTS = ['https://api.quotable.io/random', 'https://dummyjson.com/quotes/random'];

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private async fetchFromAPI(url: string): Promise<Quote | null> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!resp.ok) return null;
      const data = await resp.json();

      if (data.content && data.author) {
        return { text: data.content, author: data.author, source: 'quotable' };
      }
      if (data.quote && data.author) {
        return { text: data.quote, author: data.author, source: 'dummyjson' };
      }
      return null;
    } catch {
      return null;
    }
  }

  private getCachedQuote(): Quote | null {
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem(QUOTE_CACHE_KEY);
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (cached && expiry && Date.now() < Number.parseInt(expiry, 10)) {
      try {
        return JSON.parse(cached) as Quote;
      } catch {
        return null;
      }
    }

    localStorage.removeItem(QUOTE_CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
    return null;
  }

  private setCachedQuote(q: Quote): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(q));
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
  }

  async getRandomQuote(): Promise<Quote> {
    const promises = API_ENDPOINTS.map(async (url) => {
      const quote = await this.fetchFromAPI(url);
      if (!quote) throw new Error(`Invalid response from ${url}`);
      return quote;
    });

    try {
      const result = await Promise.any(promises);
      this.setCachedQuote(result);
      return result;
    } catch {
      // fallback from cache or dummy quotes
      const cached = this.getCachedQuote();
      if (cached) return cached;

      return DUMMY_QUOTES[Math.floor(Math.random() * DUMMY_QUOTES.length)];
    }
  }
}
