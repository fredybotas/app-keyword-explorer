import { Store } from '../stores/Store';
import { StoreType } from '../types/StoreType';
import { App, AppIdentifier } from '../types/App';
import { GetAppDataRequest } from '../validation/types/GetAppDataRequest';
import { GetSuggestionsRequest } from '../validation/types/GetSuggestionsRequest';
import { GetSearchResultRequest } from '../validation/types/GetSearchResultRequest';
import { getLogger } from '../utils/logger';
import { StoreCountry } from '../types/StoreCountry';

export type Stores = {
  // eslint-disable-next-line no-unused-vars
  [key in StoreType]: Store;
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
          LOGGER.error(err.message);
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

  async getAppRanking(id: string, query: string, store: StoreType, country: StoreCountry): Promise<number> {
    const searchResults = await this.getSearchResultInternal({ query: query, storeType: store, storeCountry: country });
    const ranking = searchResults.findIndex((appId: AppIdentifier) => appId === id);
    if (ranking === -1) {
      throw new Error(StoreError.APP_NOT_RANKED);
    }
    return ranking + 1;
  }
}
