import gs from 'generate-schema';

import { type TransformerFn } from '../types';

const mysqlTransformer: TransformerFn = async (value) => {
  return gs.mysql(JSON.parse(value));
};

export default mysqlTransformer;
