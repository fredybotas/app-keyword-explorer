import { IStore } from '../stores/IStore';
import { StoreType } from '../types/StoreType';
import { App, AppIdentifier } from '../types/App';
import {
  GetSuggestionsRequest,
  GetSearchResultRequest,
  GetAppDataRequest,
  GetAppRankingRequest,
} from '../validation/types';
import { getLogger } from '../utils/logger';
import { StoreCountry } from '../types/StoreCountry';

export type Stores = {
  // eslint-disable-next-line no-unused-vars
  [key in StoreType]: IStore;
};

export enum StoreError {
  APP_NOT_FOUND = 'app_not_found',
  APP_NOT_RANKED = 'app_not_ranked',
}

const LOGGER = getLogger();
export class StoreService {
  constructor(private readonly stores: Stores) {}

  private async getSearchResultInternal(request: GetSearchResultRequest): Promise<AppIdentifier[]> {
    return this.stores[request.storeType].getSearchResult(request.storeCountry ?? StoreCountry.us, request.query);
  }

  async getApp(request: GetAppDataRequest): Promise<App> {
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
          throw err;
      }
    }
  }

  async getSuggestions(request: GetSuggestionsRequest): Promise<string[]> {
    return this.stores[request.storeType].getSuggestions(request.query);
  }

  async getSearchResult(request: GetSearchResultRequest): Promise<App[]> {
    const searchResultIds = await this.getSearchResultInternal(request);
    if (request.collectMetadata === undefined || request.collectMetadata === false) {
      return searchResultIds.map((appId: AppIdentifier) => ({ id: appId }));
    }

    return Promise.allSettled(
      searchResultIds.map((id: AppIdentifier): Promise<App | null> => {
        return this.getApp({ storeType: request.storeType, id: id });
      }),
    )
      .then((promises: PromiseSettledResult<App | null>[]) => {
        return promises
          .filter((x): x is PromiseFulfilledResult<App | null> => x.status === 'fulfilled')
          .map((promise: PromiseFulfilledResult<App | null>) => promise.value);
      })
      .then((apps: (App | null)[]): App[] => {
        return apps.filter((app: App | null): boolean => {
          return app !== null;
        }) as App[];
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
