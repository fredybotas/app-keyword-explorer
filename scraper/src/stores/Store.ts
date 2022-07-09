import { StoreCountry } from '../types/StoreCountry';
import { App } from '../types/App';

export interface Store {
  getApp: (id: number) => Promise<App | null>;
  getSuggestions: (query: string) => Promise<Array<string>>;
  getSearchResult: (store: StoreCountry, query: string) => Promise<Array<App>>;
}
