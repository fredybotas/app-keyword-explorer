import { StoreCountry } from '../types/StoreCountry';
import { App, AppIdentifier } from '../types/App';
import { IStore } from './IStore';
import { getLogger } from '../utils/logger';
import { ReviewSortCriteria, Review } from '../types/Review';

const LOGGER = getLogger('APPSTORE');

export class AppleAppStore implements IStore {
  constructor(private readonly client: any) {}

  private reviewSortCriteriaToLibType(sortedBy: ReviewSortCriteria): any {
    switch (sortedBy) {
      case ReviewSortCriteria.RECENT:
        return this.client.sort.RECENT;
      case ReviewSortCriteria.HELPFUL:
        return this.client.sort.HELPFUL;
    }
  }

  async getApp(id: string): Promise<App | null> {
    try {
      const appData = await this.client.app({ id });
      return {
        id,
        metadata: {
          name: appData.title,
          appId: appData.appId,
          description: appData.description,
        },
      };
    } catch (err: any) {
      if (err.message === 'App not found (404)') {
        return null;
      }
      LOGGER.error('Error while fetching app: ' + err.message);
      throw new Error(err.message);
    }
  }

  async getSuggestions(query: string): Promise<Array<string>> {
    try {
      const suggestions = await this.client.suggest({ term: query });
      return suggestions.map((suggestion: any) => suggestion.term);
    } catch (err: any) {
      LOGGER.error('Error while getting suggestions: ' + err.message);
      throw new Error(err.message);
    }
  }

  async getSearchResult(store: StoreCountry, query: string): Promise<AppIdentifier[]> {
    try {
      const searchResult = await this.client.search({
        term: query,
        country: store,
        num: 200,
        idsOnly: true,
      });
      return searchResult;
    } catch (err: any) {
      LOGGER.error('Error while getting search result: ' + err.message);
      throw new Error(err.message);
    }
  }

  async getReviews(id: string, store: StoreCountry, sortedBy: ReviewSortCriteria, page: number): Promise<Review[]> {
    try {
      const reviewPage = await this.client.reviews({
        id,
        country: store,
        page,
        sort: this.reviewSortCriteriaToLibType(sortedBy),
      });
      return reviewPage.map((review: any) => {
        return {
          title: review.title,
          content: review.text,
          rating: review.score,
        };
      });
    } catch (err: any) {
      LOGGER.error('Error while getting reviews: ' + err.message);
      throw new Error(err.message);
    }
  }
}
