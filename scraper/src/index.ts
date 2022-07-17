import express from 'express';
import bodyParser from 'body-parser';

import { Stores, StoreService } from './services/StoreService';
import { AppleAppStore, GooglePlayStore } from './stores';
import { middleware as requestLoggerMiddleware } from './middlewares/requestLogger';
import { router as storeRouter } from './routes/store';
import { middleware as ErrorHandler } from './middlewares/error';
import { middleware as NotFoundHandler } from './middlewares/notFound';

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', storeRouter);
app.use(NotFoundHandler());
app.use(ErrorHandler());

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
