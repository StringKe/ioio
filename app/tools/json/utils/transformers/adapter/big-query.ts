import gs from 'generate-schema';

import { type TransformerFn } from '../types';

const bigQueryTransformer: TransformerFn = async (value) => {
  return JSON.stringify(gs.bigquery(JSON.parse(value)), null, 2);
};

export default bigQueryTransformer;
