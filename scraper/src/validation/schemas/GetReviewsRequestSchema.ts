import { ReviewSortCriteria } from '../../types/Review';
import { StoreCountry } from '../../types/StoreCountry';
import { StoreType } from '../../types/StoreType';

export const schema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      store: {
        type: 'string',
        enum: Object.values(StoreType),
      },
    },
    required: ['store', 'id'],
    additionalProperties: false,
  },
  query: {
    type: 'object',
    properties: {
      country: {
        type: 'string',
        enum: Object.values(StoreCountry),
      },
      criteria: {
        type: 'string',
        enum: Object.values(ReviewSortCriteria),
      },
    },
    required: [],
    additionalProperties: false,
  },
};
