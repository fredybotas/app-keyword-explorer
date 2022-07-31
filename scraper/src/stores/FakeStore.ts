/* eslint-disable @typescript-eslint/no-unused-vars */
import { App } from '../types/App';
import { ReviewSortCriteria, Review } from '../types/Review';
import { StoreCountry } from '../types/StoreCountry';
import { IStore } from './IStore';

export class FakeStore implements IStore {
  async getApp(id: string): Promise<App | null> {
    const app: App = { id, metadata: { name: 'a', appId: 'b', description: 'desc' } };
    return app;
  }

  async getSuggestions(query: string): Promise<string[]> {
    return ['suggestion', 'test', 'now'];
  }

  async getSearchResult(store: StoreCountry, query: string): Promise<string[]> {
    return ['1207472156', '1095569891', 'id3'];
  }

  async getReviews(id: string, store: StoreCountry, sortedBy: ReviewSortCriteria, page: number): Promise<Review[]> {
    return [
      { title: 'test_review1', content: 'a', rating: 5 },
      { title: 'test_review2', content: 'b', rating: 4 },
      { title: 'test_review3', content: 'c', rating: 2 },
      { title: 'test_review4', content: 'd', rating: 3 },
    ];
  }
}
