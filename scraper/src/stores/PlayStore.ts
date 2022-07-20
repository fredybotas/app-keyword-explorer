import { StoreCountry } from '../types/StoreCountry';
import { App, AppIdentifier } from '../types/App';
import { IStore } from './IStore';

export class GooglePlayStore implements IStore {
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
