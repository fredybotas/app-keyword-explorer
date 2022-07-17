import { StoreCountry } from '../types/StoreCountry';
import { App } from '../types/App';
import { Store } from '../stores/Store';

export class AppleAppStore implements Store {
  constructor(private readonly client: any) {}

  async getApp(id: number): Promise<App | null> {
    try {
      const appData = await this.client.app({ id });
      return {
        id,
        name: appData.title,
        appId: appData.appId,
        description: appData.description,
      };
    } catch (err: any) {
      if (err.message === 'App not found (404)') {
        return null;
      }
      throw new Error(err.message);
    }
  }

  async getSuggestions(query: string): Promise<Array<string>> {
    try {
      const suggestions = await this.client.suggest({ term: query });
      return suggestions.map((suggestion: any) => suggestion.term);
    } catch (message: any) {
      throw new Error(message);
    }
  }

  async getSearchResult(store: StoreCountry, query: string): Promise<App[]> {
    try {
      const searchResult = await this.client.search({
        term: query,
        country: store,
      });
      return searchResult.map((app: any) => {
        return {
          id: app.id,
          name: app.title,
          appId: app.appId,
          description: app.description,
        };
      });
    } catch (message: any) {
      throw new Error(message);
    }
  }
}
