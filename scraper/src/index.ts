import express from 'express';
import bodyParser from 'body-parser';

import { Stores, StoreService } from './services/StoreService';
import { AppleAppStore, GooglePlayStore } from './stores';
import { router as storeRouter } from './routes/store';
import { ErrorHandleMiddleware, NotFoundMiddleware, RequestLoggerMiddleware } from './middlewares/';
import { createClient } from 'redis';
import { CachedStoreProxy } from './stores/CachedProxyStore';
import { Cache, RedisClient } from './utils/cache';
import { RateLimitingProxyStore } from './stores/RateLimitingProxyStore';

const app = express();
const port = 3000;

const cacheClient: RedisClient = createClient();
const cache = new Cache(cacheClient);

const appStoreClient = require('app-store-scraper');
const stores: Stores = {
  appstore: new CachedStoreProxy('APPSTORE', new RateLimitingProxyStore(new AppleAppStore(appStoreClient), 20), cache),
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
