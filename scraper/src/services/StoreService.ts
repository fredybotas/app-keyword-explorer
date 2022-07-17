import { Store } from '../stores/Store';
import { StoreType } from '../types/StoreType';
import { App } from '../types/App';
import { GetAppDataRequest } from '../validation/types/GetAppDataRequest';
import { GetSuggestionsRequest } from '../validation/types/GetSuggestionsRequest';
import { GetSearchResultRequest } from '../validation/types/GetSearchResultRequest';
import { getLogger } from '../utils/logger';

export type Stores = {
  // eslint-disable-next-line no-unused-vars
  [key in StoreType]: Store;
};

export enum StoreError {
  APP_NOT_FOUND = 'app_not_found',
}

const LOGGER = getLogger();
export class StoreService {
  constructor(private readonly stores: Stores) {}

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
    return this.stores[request.storeType].getSearchResult(request.store, request.query);
  }
}
