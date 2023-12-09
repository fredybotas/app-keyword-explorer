import { IStore } from '../stores/IStore';
import { StoreType } from '../types/StoreType';
import { App, AppIdentifier } from '../types/App';
import { Review, ReviewSortCriteria } from '../types/Review';
import {
  GetSuggestionsRequest,
  GetSearchResultRequest,
  GetAppDataRequest,
  GetAppRankingRequest,
  GetReviewsRequest,
  GetListRequest,
} from '../validation/types';
import { StoreCountry } from '../types/StoreCountry';

export type Stores = {
  [key in StoreType]: IStore;
};

export enum StoreError {
  APP_NOT_FOUND = 'app_not_found',
  APP_NOT_RANKED = 'app_not_ranked',
  STORE_FETCH_ERROR = 'store_fetch_error',
}

export class StoreService {
  private readonly MAX_REVIEW_PAGE = 10;

  constructor(private readonly stores: Stores) {}

  private async getSearchResultInternal(request: GetSearchResultRequest): Promise<AppIdentifier[]> {
    try {
      return await this.stores[request.storeType].getSearchResult(
        request.storeCountry ?? StoreCountry.us,
        request.query,
      );
    } catch (err: any) {
      throw new Error(StoreError.STORE_FETCH_ERROR);
    }
  }

  private async getListResultInternal(request: GetListRequest): Promise<AppIdentifier[]> {
    try {
      return await this.stores[request.storeType].getListResult(
        request.storeCountry ?? StoreCountry.us,
        request.category,
        request.collection,
      );
    } catch (err: any) {
      throw new Error(StoreError.STORE_FETCH_ERROR);
    }
  }

  private async getAppInternal(request: GetAppDataRequest): Promise<App> {
    try {
      const app = await this.stores[request.storeType].getApp(request.id);
      if (!app) {
        throw new Error(StoreError.APP_NOT_FOUND);
      }
      return app;
    } catch (err: any) {
      switch (err.message) {
        case StoreError.APP_NOT_FOUND:
          throw err;
        default:
          throw new Error(StoreError.STORE_FETCH_ERROR);
      }
    }
  }

  async getApp(request: GetAppDataRequest): Promise<App> {
    return this.getAppInternal(request);
  }

  async getSuggestions(request: GetSuggestionsRequest): Promise<string[]> {
    try {
      return await this.stores[request.storeType].getSuggestions(request.query);
    } catch (err: any) {
      throw new Error(StoreError.STORE_FETCH_ERROR);
    }
  }

  private async fillMetadataIfRequired(
    collectMetadata: any,
    results: AppIdentifier[],
    storeType: StoreType,
  ): Promise<App[]> {
    if (collectMetadata === undefined || collectMetadata === false) {
      return results.map((appId: AppIdentifier) => ({ id: appId }));
    }

    const appsFromIds = await Promise.allSettled(
      results.map((id: AppIdentifier): Promise<App> => {
        return this.getAppInternal({ storeType, id });
      }),
    );

    return results.map((appId: AppIdentifier, index: number) => {
      return appsFromIds[index].status === 'fulfilled'
        ? (appsFromIds[index] as PromiseFulfilledResult<App>).value
        : { id: appId };
    });
  }

  async getSearchResult(request: GetSearchResultRequest): Promise<App[]> {
    const searchResultIds = await this.getSearchResultInternal(request);
    return this.fillMetadataIfRequired(request.collectMetadata, searchResultIds, request.storeType);
  }

  async getListResult(request: GetListRequest): Promise<App[]> {
    const listResultIds = await this.getListResultInternal(request);
    return this.fillMetadataIfRequired(request.collectMetadata, listResultIds, request.storeType);
  }

  async getAppRanking(data: GetAppRankingRequest): Promise<number> {
    const searchResults = await this.getSearchResultInternal({
      query: data.query,
      storeType: data.storeType,
      storeCountry: data.storeCountry,
    });
    const ranking = searchResults.findIndex((appId: AppIdentifier) => appId === data.appId);
    if (ranking === -1) {
      throw new Error(StoreError.APP_NOT_RANKED);
    }
    return ranking + 1;
  }

  async getReviews(data: GetReviewsRequest): Promise<Review[]> {
    // check if app exists, otherwise throw error
    await this.getAppInternal({ storeType: data.storeType, id: data.appId });

    try {
      const reviews: Review[] = [];
      for (let page: number = 1; page <= this.MAX_REVIEW_PAGE; ++page) {
        const reviewPage = await this.stores[data.storeType].getReviews(
          data.appId,
          data.storeCountry ?? StoreCountry.us,
          data.criteria ?? ReviewSortCriteria.HELPFUL,
          page,
        );
        reviews.push(...reviewPage);
      }
      return reviews;
    } catch (err: any) {
      throw new Error(StoreError.STORE_FETCH_ERROR);
    }
  }
}
