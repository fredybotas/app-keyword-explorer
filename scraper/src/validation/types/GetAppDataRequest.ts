import { StoreType } from '../../types/StoreType';

export interface GetAppDataRequest {
  id: string;
  storeType: StoreType;
}
