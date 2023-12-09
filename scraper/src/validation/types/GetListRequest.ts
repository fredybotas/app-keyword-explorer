import { ListCollection } from '../../types/ListCollection';
import { ListCategory } from '../../types/ListCategory';
import { StoreCountry } from '../../types/StoreCountry';
import { StoreType } from '../../types/StoreType';

export interface GetListRequest {
  collection: ListCollection;
  category: ListCategory;
  storeCountry?: StoreCountry;
  storeType: StoreType;
  collectMetadata?: boolean;
}
