import { App } from '../types/App';
import { ReviewSortCriteria, Review } from '../types/Review';
import { StoreCountry } from '../types/StoreCountry';
import { IStore } from './IStore';

export class RateLimitingProxyStore implements IStore {
  private lastRequest = Date.now();

  constructor(private readonly store: IStore, private readonly requestsPerMin: number = 20) {}

  async getApp(id: string): Promise<App | null> {
    this.lastRequest = Date.now();
    return this.store.getApp(id);
  }

  async getSuggestions(query: string): Promise<string[]> {
    this.lastRequest = Date.now();
    return this.store.getSuggestions(query);
  }

  async getSearchResult(store: StoreCountry, query: string): Promise<string[]> {
    this.lastRequest = Date.now();
    return this.store.getSearchResult(store, query);
  }

  async getReviews(id: string, store: StoreCountry, sortedBy: ReviewSortCriteria, page: number): Promise<Review[]> {
    this.lastRequest = Date.now();
    return this.store.getReviews(id, store, sortedBy, page);
  }
}
