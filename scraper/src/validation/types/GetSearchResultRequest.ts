import { StoreCountry } from '../../types/StoreCountry';
import { StoreType } from '../../types/StoreType';

export interface GetSearchResultRequest {
  query: string;
  storeCountry?: StoreCountry;
  storeType: StoreType;
  collectMetadata?: boolean;
}
