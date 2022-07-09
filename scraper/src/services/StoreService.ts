import { Store } from '../stores/Store';
import { StoreType } from '../types/StoreType';
import { App } from '../types/App';
import { GetAppDataRequest } from '../validators/types/GetAppDataRequest';
import { GetSuggestionsRequest } from '../validators/types/GetSuggestionsRequest';
import { GetSearchResultRequest } from '../validators/types/GetSearchResultRequest';

export type Stores = {
  // eslint-disable-next-line no-unused-vars
  [key in StoreType]: Store;
};

export class StoreService {
  constructor(private readonly stores: Stores) {}

  async getApp(request: GetAppDataRequest): Promise<App | null> {
    return this.stores[request.storeType].getApp(request.id);
  }

  async getSuggestions(request: GetSuggestionsRequest): Promise<string[]> {
    return this.stores[request.storeType].getSuggestions(request.query);
  }

  async getSearchResult(request: GetSearchResultRequest): Promise<App[]> {
    return this.stores[request.storeType].getSearchResult(request.store, request.query);
  }
}
