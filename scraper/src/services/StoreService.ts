import { IStore } from '../stores/IStore';
import { StoreType } from '../types/StoreType';
import { App, AppIdentifier } from '../types/App';
import {
  GetSuggestionsRequest,
  GetSearchResultRequest,
  GetAppDataRequest,
  GetAppRankingRequest,
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
  constructor(private readonly stores: Stores) {}

  private async getSearchResultInternal(request: GetSearchResultRequest): Promise<AppIdentifier[]> {
    try {
      return this.stores[request.storeType].getSearchResult(request.storeCountry ?? StoreCountry.us, request.query);
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
      return this.stores[request.storeType].getSuggestions(request.query);
    } catch (err: any) {
      throw new Error(StoreError.STORE_FETCH_ERROR);
    }
  }

  async getSearchResult(request: GetSearchResultRequest): Promise<App[]> {
    const searchResultIds = await this.getSearchResultInternal(request);
    if (request.collectMetadata === undefined || request.collectMetadata === false) {
      return searchResultIds.map((appId: AppIdentifier) => ({ id: appId }));
    }

    const appsFromIds = await Promise.allSettled(
      searchResultIds.map((id: AppIdentifier): Promise<App> => {
        return this.getAppInternal({ storeType: request.storeType, id: id });
      }),
    );

    return searchResultIds.map((appId: AppIdentifier, index: number) => {
      return appsFromIds[index].status === 'fulfilled'
        ? (appsFromIds[index] as PromiseFulfilledResult<App>).value
        : { id: appId };
    });
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
}
