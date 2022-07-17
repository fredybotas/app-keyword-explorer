import { StoreType } from '../../types/StoreType';

export interface GetAppDataRequest {
  id: number;
  storeType: StoreType;
}
