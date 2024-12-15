import { type TransformerFn } from '../types';

const goBsonTransformer: TransformerFn = async (value) => {
  return JSON.stringify(JSON.parse(value || '{}'), null, 2)
    .replace(/\{/gm, 'bson.M{')
    .replace(/\[/gm, 'bson.A{')
    .replace(/\]/gm, '}')
    .replace(/(\d|\w|")$/gm, '$1,')
    .replace(/(\}$)(\n)/gm, '$1,$2');
};

export default goBsonTransformer;
