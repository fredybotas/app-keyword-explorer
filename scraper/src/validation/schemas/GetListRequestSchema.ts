import { ListCategory } from '../../types/ListCategory';
import { StoreCountry } from '../../types/StoreCountry';
import { StoreType } from '../../types/StoreType';
import { ListCollection } from '../../types/ListCollection';

export const schema = {
  params: {
    type: 'object',
    properties: {
      store: {
        type: 'string',
        enum: Object.values(StoreType),
      },
    },
    required: ['store'],
    additionalProperties: false,
  },
  query: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: Object.values(ListCategory),
      },
      collection: {
        type: 'string',
        enum: Object.values(ListCollection),
      },
      country: {
        type: 'string',
        enum: Object.values(StoreCountry),
      },
      collectMetadata: {
        type: 'boolean',
      },
    },
    required: ['category', 'collection'],
    additionalProperties: false,
  },
};
