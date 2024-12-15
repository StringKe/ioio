import gs from 'generate-schema';

import { type TransformerFn } from '../types';

const mongooseTransformer: TransformerFn = async (value) => {
  return JSON.stringify(gs.mongoose(JSON.parse(value)), null, 2);
};

export default mongooseTransformer;
