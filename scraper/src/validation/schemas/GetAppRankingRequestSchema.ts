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
      query: {
        type: 'string',
      },
      country: {
        type: 'string',
        enum: Object.values(StoreCountry),
      },
    },
    required: ['query'],
    additionalProperties: false,
  },
};
