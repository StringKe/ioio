import transform from 'transform-json-types';

import { type TransformerFn } from '../types';

const scalaCaseClassTransformer: TransformerFn = async (value) => {
  return transform(value, {
    lang: 'scala',
  });
};

export default scalaCaseClassTransformer;
