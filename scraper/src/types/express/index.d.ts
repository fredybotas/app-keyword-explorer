import { StoreService } from '../../services/StoreService';

declare global {
  namespace Express {
    interface Application {
      services: {
        storeService: StoreService;
      };
    }
  }
}
