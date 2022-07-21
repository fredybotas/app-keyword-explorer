import { StoreCountry } from '../../types/StoreCountry';
import { AppIdentifier } from '../../types/App';
import { StoreType } from '../../types/StoreType';
import { ReviewSortCriteria } from '../../types/Review';

export interface GetReviewsRequest {
  appId: AppIdentifier;
  storeCountry?: StoreCountry;
  storeType: StoreType;
  criteria?: ReviewSortCriteria;
}
