import { StoreCountry } from '../types/StoreCountry';
import { App, AppIdentifier } from '../types/App';
import { IStore } from './IStore';
import { getLogger } from '../utils/logger';

const LOGGER = getLogger('APPSTORE');

export class AppleAppStore implements IStore {
  constructor(private readonly client: any) {}

  async getApp(id: string): Promise<App | null> {
    try {
      const appData = await this.client.app({ id });
      return {
        id,
        metadata: {
          name: appData.title,
          appId: appData.appId,
          description: appData.description,
        },
      };
    } catch (err: any) {
      if (err.message === 'App not found (404)') {
        return null;
      }
      LOGGER.error('Error while fetching app: ' + err.message);
      throw new Error(err.message);
    }
  }

  async getSuggestions(query: string): Promise<Array<string>> {
    try {
      const suggestions = await this.client.suggest({ term: query });
      return suggestions.map((suggestion: any) => suggestion.term);
    } catch (err: any) {
      LOGGER.error('Error while getting suggestions: ' + err.message);
      throw new Error(err.message);
    }
  }

  async getSearchResult(store: StoreCountry, query: string): Promise<AppIdentifier[]> {
    try {
      const searchResult = await this.client.search({
        term: query,
        country: store,
        num: 200,
        idsOnly: true,
      });
      return searchResult;
    } catch (err: any) {
      LOGGER.error('Error while getting search result: ' + err.message);
      throw new Error(err.message);
    }
  }
}
