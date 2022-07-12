import express from 'express';
import { Stores, StoreService } from './services/StoreService';
import { AppleAppStore } from './stores/AppStore';
import { GooglePlayStore } from './stores/PlayStore';
import { middleware as requestLoggerMiddleware } from './middlewares/requestLogger';
import { router as storeRouter } from './routes/store';
// import { Store } from './stores/Store';
// import { StoreType } from './types/StoreType';

const app = express();
const port = 3000;

const appStoreClient = require('app-store-scraper');
const stores: Stores = {
  appstore: new AppleAppStore(appStoreClient),
  playstore: new GooglePlayStore(),
};
const storeService: StoreService = new StoreService(stores);

app.services = {
  storeService: storeService,
};

app.use(requestLoggerMiddleware());
app.use('/store', storeRouter);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
