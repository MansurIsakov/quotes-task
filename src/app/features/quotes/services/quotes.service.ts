import { Injectable } from '@angular/core';
import { Quote } from '../types/quote';

const HARDCODED_QUOTES: Quote[] = [
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    source: 'local',
  },
  {
    text: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
    source: 'local',
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: 'John Lennon',
    source: 'local',
  },
  {
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    source: 'local',
  },
  {
    text: 'It is during our darkest moments that we must focus to see the light.',
    author: 'Aristotle',
    source: 'local',
  },
  {
    text: 'The only impossible journey is the one you never begin.',
    author: 'Tony Robbins',
    source: 'local',
  },
  {
    text: 'Success is not final, failure is not fatal.',
    author: 'Winston Churchill',
    source: 'local',
  },
  {
    text: "Believe you can and you're halfway there.",
    author: 'Theodore Roosevelt',
    source: 'local',
  },
];

const CACHE_KEY = 'quote_cache';
const CACHE_EXPIRY_KEY = 'quote_cache_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const API_ENDPOINTS = ['https://api.quotable.io/random', 'https://dummyjson.com/quotes/random'];

@Injectable({ providedIn: 'root' })
export class QuotesService {
  constructor() {}

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
    const cached = localStorage.getItem(CACHE_KEY);
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (cached && expiry && Date.now() < Number.parseInt(expiry, 10)) {
      try {
        return JSON.parse(cached) as Quote;
      } catch {
        return null;
      }
    }
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
    return null;
  }

  private setCachedQuote(q: Quote) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CACHE_KEY, JSON.stringify(q));
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
  }

  async getRandomQuote(): Promise<Quote> {
    // race API endpoints and pick first successful
    try {
      const promises = API_ENDPOINTS.map((url) => this.fetchFromAPI(url));
      const results = await Promise.allSettled(promises);
      for (const r of results) {
        // take first fulfilled value that is not null
        if (r.status === 'fulfilled' && r.value) {
          this.setCachedQuote(r.value);
          return r.value;
        }
      }
    } catch {
      // fall through to cache or fallback
    }

    const cached = this.getCachedQuote();
    if (cached) return cached;

    // fallback
    return HARDCODED_QUOTES[Math.floor(Math.random() * HARDCODED_QUOTES.length)];
  }

  getRandomHardcodedQuote(): Quote {
    return HARDCODED_QUOTES[Math.floor(Math.random() * HARDCODED_QUOTES.length)];
  }
}
