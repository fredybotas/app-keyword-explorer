import { StoreType } from '../../types/StoreType';

export const schema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      store: {
        type: 'string',
        enum: Object.values(StoreType),
      },
    },
    required: ['id', 'store'],
    additionalProperties: false,
  },
};
