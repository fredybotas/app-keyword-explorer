import { Router } from 'express';
import { HttpError } from '../utils/errors/HttpError';
import { middleware as validate } from '../middlewares/validator';
import {
  GetAppRequestSchema,
  GetSuggestionsRequestSchema,
  GetSearchResultRequestSchema,
  GetAppRankingRequestSchema,
  GetReviewsRequestSchema,
  GetListRequestSchema,
} from '../validation/schemas';
import {
  GetAppDataRequest,
  GetSuggestionsRequest,
  GetSearchResultRequest,
  GetAppRankingRequest,
  GetReviewsRequest,
  GetListRequest,
} from '../validation/types/';

import { StoreError } from '../services/StoreService';

export const router = Router();

router.get('/:store/suggestions', validate(GetSuggestionsRequestSchema), async (req, res, next) => {
  const data: GetSuggestionsRequest = {
    storeType: req.params.store,
    query: req.query.query,
  };

  try {
    const suggestions: string[] = await req.app.services.storeService.getSuggestions(data);
    return res.status(200).json(suggestions);
  } catch (err: any) {
    switch (err.message) {
      case StoreError.STORE_FETCH_ERROR:
        next(new HttpError(503, StoreError.STORE_FETCH_ERROR));
        break;
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
      case StoreError.STORE_FETCH_ERROR:
        next(new HttpError(503, StoreError.STORE_FETCH_ERROR));
        break;
      case StoreError.APP_NOT_FOUND:
        next(new HttpError(404, StoreError.APP_NOT_FOUND));
        break;
      default:
        next(new HttpError(500, 'Internal Server Error'));
        break;
    }
  }
});

router.get('/:store/reviews/:id', validate(GetReviewsRequestSchema), async (req, res, next) => {
  const data: GetReviewsRequest = {
    storeType: req.params.store,
    appId: req.params.id,
    criteria: req.query.criteria,
    storeCountry: req.query.country,
  };

  try {
    const app = await req.app.services.storeService.getReviews(data);
    return res.status(200).json(app);
  } catch (err: any) {
    switch (err.message) {
      case StoreError.STORE_FETCH_ERROR:
        next(new HttpError(503, StoreError.STORE_FETCH_ERROR));
        break;
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
    storeCountry: req.query.country,
    query: req.query.query,
    collectMetadata: req.query.collectMetadata,
  };

  try {
    const app = await req.app.services.storeService.getSearchResult(data);
    return res.status(200).json(app);
  } catch (err: any) {
    switch (err.message) {
      case StoreError.STORE_FETCH_ERROR:
        next(new HttpError(503, StoreError.STORE_FETCH_ERROR));
        break;
      default:
        next(new HttpError(500, 'Internal Server Error'));
        break;
    }
  }
});

router.get('/:store/list', validate(GetListRequestSchema), async (req, res, next) => {
  const data: GetListRequest = {
    storeType: req.params.store,
    category: req.query.category,
    collection: req.query.collection,
    storeCountry: req.query.country,
    collectMetadata: req.query.collectMetadata,
  };

  try {
    const app = await req.app.services.storeService.getListResult(data);
    return res.status(200).json(app);
  } catch (err: any) {
    switch (err.message) {
      case StoreError.STORE_FETCH_ERROR:
        next(new HttpError(503, StoreError.STORE_FETCH_ERROR));
        break;
      default:
        next(new HttpError(500, 'Internal Server Error'));
        break;
    }
  }
});

router.get('/:store/ranking/:id', validate(GetAppRankingRequestSchema), async (req, res, next) => {
  const data: GetAppRankingRequest = {
    appId: req.params.id,
    storeType: req.params.store,
    storeCountry: req.query.country,
    query: req.query.query,
  };

  try {
    const ranking = await req.app.services.storeService.getAppRanking(data);
    return res.status(200).json({ ranking });
  } catch (err: any) {
    switch (err.message) {
      case StoreError.APP_NOT_RANKED:
        next(new HttpError(404, StoreError.APP_NOT_RANKED));
        break;
      case StoreError.STORE_FETCH_ERROR:
        next(new HttpError(503, StoreError.STORE_FETCH_ERROR));
        break;
      default:
        next(new HttpError(500, 'Internal Server Error'));
        break;
    }
  }
});
