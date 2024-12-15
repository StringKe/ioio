import gofmt from 'gofmt.js';
import jsonToGo from 'json-to-go';

import { type TransformerFn } from '../types';

const goTransformer: TransformerFn = async (value) => {
  return gofmt(jsonToGo(value));
};

export default goTransformer;
