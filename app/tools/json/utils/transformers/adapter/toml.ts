import { stringify } from 'smol-toml';

import { type TransformerFn } from '../types';

const tomlTransformer: TransformerFn = async (value) => {
  return stringify(JSON.parse(value));
};

export default tomlTransformer;
