import gs from 'generate-schema';

import { type TransformerFn } from '../types';

const mysqlTransformer: TransformerFn = async (value) => {
  return JSON.stringify(gs.mysql(JSON.parse(value)), null, 2);
};

export default mysqlTransformer;