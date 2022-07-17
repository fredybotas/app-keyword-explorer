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
    },
    required: ['query'],
    additionalProperties: false,
  },
};
