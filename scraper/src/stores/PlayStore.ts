import { StoreCountry } from '../types/StoreCountry';
import { App } from '../types/App';
import { Store } from '../stores/Store';

export class GooglePlayStore implements Store {
  getApp(id: number): Promise<App | null> {
    throw new Error('Method not implemented.');
  }

  getSuggestions(query: string): Promise<Array<string>> {
    throw new Error('Method not implemented.');
  }

  getSearchResult(store: StoreCountry, query: string): Promise<App[]> {
    throw new Error('Method not implemented.');
  }
}
