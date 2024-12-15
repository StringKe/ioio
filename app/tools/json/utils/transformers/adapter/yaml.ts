import { dump } from 'js-yaml';

import { type TransformerFn } from '../types';

const yamlTransformer: TransformerFn = async (value) => {
  return dump(JSON.parse(value));
};

export default yamlTransformer;
