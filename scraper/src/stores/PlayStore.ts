import { StoreCountry } from '../types/StoreCountry';
import { App, AppIdentifier } from '../types/App';
import { Store } from '../stores/Store';

export class GooglePlayStore implements Store {
  getApp(id: string): Promise<App | null> {
    throw new Error('Method not implemented.');
  }

  getSuggestions(query: string): Promise<Array<string>> {
    throw new Error('Method not implemented.');
  }

  getSearchResult(store: StoreCountry, query: string): Promise<AppIdentifier[]> {
    throw new Error('Method not implemented.');
  }
}
