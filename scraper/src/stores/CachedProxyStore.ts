import { App } from '../types/App';
import { ReviewSortCriteria, Review } from '../types/Review';
import { StoreCountry } from '../types/StoreCountry';
import { IStore } from './IStore';
import { Cache } from '../utils/cache';
import { ListCategory } from '../types/ListCategory';
import { ListCollection } from '../types/ListCollection';

export class CachedStoreProxy implements IStore {
  constructor(private readonly key: string, private readonly store: IStore, private readonly cache: Cache) {}

  getKey(...keys: string[]): string {
    let result = this.key + ';';
    for (const key of keys) {
      result += key + ';';
    }
    return result;
  }

  async getApp(id: string): Promise<App | null> {
    return this.cache.cacheProxy<App | null>(() => {
      return this.store.getApp(id);
    }, this.getKey(this.getApp.name, id));
  }

  async getSuggestions(query: string): Promise<string[]> {
    return this.cache.cacheProxy<string[]>(() => {
      return this.store.getSuggestions(query);
    }, this.getKey(this.getSuggestions.name, query));
  }

  async getSearchResult(store: StoreCountry, query: string): Promise<string[]> {
    return this.cache.cacheProxy<string[]>(() => {
      return this.store.getSearchResult(store, query);
    }, this.getKey(this.getSearchResult.name, store, query));
  }

  async getListResult(store: StoreCountry, category: ListCategory, collection: ListCollection): Promise<string[]> {
    return this.cache.cacheProxy<string[]>(() => {
      return this.store.getListResult(store, category, collection);
    }, this.getKey(this.getListResult.name, store, category, collection));
  }

  async getReviews(id: string, store: StoreCountry, sortedBy: ReviewSortCriteria, page: number): Promise<Review[]> {
    // There might be some incosistency with reviews between the store and the cache because of paging
    return this.cache.cacheProxy<Review[]>(() => {
      return this.store.getReviews(id, store, sortedBy, page);
    }, this.getKey(this.getReviews.name, id, store, sortedBy, page.toString()));
  }
}
