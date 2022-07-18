import { Router } from 'express';
import { HttpError } from '../utils/errors/HttpError';
import { middleware as validate } from '../middlewares/validator';
import { schema as GetAppRequestSchema } from '../validation/schemas/GetAppDataRequestSchema';
import { schema as GetSuggestionsRequestSchema } from '../validation/schemas/GetSuggestionsRequestSchema';
import { schema as GetSearchResultRequestSchema } from '../validation/schemas/GetSearchResultRequestSchema';

import { GetAppDataRequest } from '../validation/types/GetAppDataRequest';
import { StoreError } from '../services/StoreService';
import { getLogger } from '../utils/logger';
import { GetSuggestionsRequest } from '../validation/types/GetSuggestionsRequest';
import { GetSearchResultRequest } from '../validation/types/GetSearchResultRequest';

export const router = Router();
const LOGGER = getLogger();

router.get('/:store/suggestions', validate(GetSuggestionsRequestSchema), async (req, res, next) => {
  const data: GetSuggestionsRequest = {
    storeType: req.params.store,
    query: req.query.query,
  };

  try {
    const suggestions = await req.app.services.storeService.getSuggestions(data);
    return res.status(200).json(suggestions);
  } catch (err: any) {
    switch (err.message) {
      default:
        next(new HttpError(500, 'Internal Server Error'));
        break;
    }
  }
});

router.get('/:store/app/:id', validate(GetAppRequestSchema), async (req, res, next) => {
  const data: GetAppDataRequest = {
    storeType: req.params.store,
    id: req.params.id,
  };

  try {
    const app = await req.app.services.storeService.getApp(data);
    return res.status(200).json(app);
  } catch (err: any) {
    switch (err.message) {
      case StoreError.APP_NOT_FOUND:
        next(new HttpError(404, StoreError.APP_NOT_FOUND));
        break;
      default:
        next(new HttpError(500, 'Internal Server Error'));
        break;
    }
  }
});

router.get('/:store/search', validate(GetSearchResultRequestSchema), async (req, res, next) => {
  const data: GetSearchResultRequest = {
    storeType: req.params.store,
    store: req.query.country,
    query: req.query.query,
  };

  try {
    const app = await req.app.services.storeService.getSearchResult(data);
    return res.status(200).json(app);
  } catch (err: any) {
    switch (err.message) {
      default:
        next(new HttpError(500, 'Internal Server Error'));
        break;
    }
  }
});
