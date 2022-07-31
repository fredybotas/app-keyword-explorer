import { App } from '../types/App';
import { ReviewSortCriteria, Review } from '../types/Review';
import { StoreCountry } from '../types/StoreCountry';
import { IStore } from './IStore';

export class RateLimitingProxyStore implements IStore {
  private lastScheduledRequest = Date.now();

  constructor(private readonly store: IStore, private readonly requestsPerMin: number = 20) {}

  private minRequestTimeDiff = () => 1 / (this.requestsPerMin / 60 / 1000);

  private async delayFor<T>(ms: number, callback: () => Promise<T>): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(callback()), ms);
    });
  }

  private async scheduleRequest<T>(proxiedResource: () => Promise<T>): Promise<T> {
    const currTimestamp = Date.now();
    const nextAllowedRequestAt = this.lastScheduledRequest + this.minRequestTimeDiff();

    if (currTimestamp < nextAllowedRequestAt) {
      const delayRequestFor = nextAllowedRequestAt - currTimestamp;
      this.lastScheduledRequest = nextAllowedRequestAt;
      return this.delayFor<T>(delayRequestFor, proxiedResource);
    }

    this.lastScheduledRequest = currTimestamp;
    return proxiedResource();
  }

  async getApp(id: string): Promise<App | null> {
    return this.store.getApp(id);
  }

  async getSuggestions(query: string): Promise<string[]> {
    return this.store.getSuggestions(query);
  }

  async getSearchResult(store: StoreCountry, query: string): Promise<string[]> {
    return this.scheduleRequest<string[]>(() => this.store.getSearchResult(store, query));
  }

  async getReviews(id: string, store: StoreCountry, sortedBy: ReviewSortCriteria, page: number): Promise<Review[]> {
    return this.store.getReviews(id, store, sortedBy, page);
  }
}
