import { StoreType } from '../../types/StoreType';

export interface GetSuggestionsRequest {
  query: string;
  storeType: StoreType;
}
