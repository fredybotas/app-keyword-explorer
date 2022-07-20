import { StoreCountry } from '../../types/StoreCountry';
import { StoreType } from '../../types/StoreType';

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
      query: {
        type: 'string',
      },
      country: {
        type: 'string',
        enum: Object.values(StoreCountry),
      },
      collectMetadata: {
        type: 'boolean',
      },
    },
    required: ['query'],
    additionalProperties: false,
  },
};
