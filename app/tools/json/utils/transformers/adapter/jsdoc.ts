import { type TransformerFn } from '../types';
import { convert } from './json-to-jsdoc.js';

const jsdocTransformer: TransformerFn = async (value) => {
  return convert(value);
};

export default jsdocTransformer;
