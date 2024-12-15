import { json2ts } from 'json-ts';

import { type TransformerFn } from '../types';

const flowTransformer: TransformerFn = async (value) => {
  return json2ts(value, { flow: true, namespace: '', prefix: 'I', rootName: 'RootObject' });
};

export default flowTransformer;
