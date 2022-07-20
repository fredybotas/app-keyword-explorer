import { StoreCountry } from '../../types/StoreCountry';
import { AppIdentifier } from '../../types/App';
import { StoreType } from '../../types/StoreType';

export interface GetAppRankingRequest {
  appId: AppIdentifier;
  query: string;
  storeType: StoreType;
  storeCountry?: StoreCountry;
}
