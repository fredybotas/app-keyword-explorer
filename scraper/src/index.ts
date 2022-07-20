import express from 'express';
import bodyParser from 'body-parser';

import { Stores, StoreService } from './services/StoreService';
import { AppleAppStore, GooglePlayStore } from './stores';
import { router as storeRouter } from './routes/store';
import { ErrorHandleMiddleware, NotFoundMiddleware, RequestLoggerMiddleware } from './middlewares/';

const app = express();
const port = 3000;

const appStoreClient = require('app-store-scraper');
const stores: Stores = {
  appstore: new AppleAppStore(appStoreClient),
  playstore: new GooglePlayStore(),
};
const storeService: StoreService = new StoreService(stores);

app.services = {
  storeService,
};

app.use(RequestLoggerMiddleware());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', storeRouter);
app.use(NotFoundMiddleware());
app.use(ErrorHandleMiddleware());

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
