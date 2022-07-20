import { StoreCountry } from '../../types/StoreCountry';
import { StoreType } from '../../types/StoreType';

export interface GetSearchResultRequest {
  query: string;
  store?: StoreCountry;
  storeType: StoreType;
  collectMetadata?: boolean;
}
