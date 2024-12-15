import { jsonToSchema } from '@walmartlabs/json-to-simple-graphql-schema/lib';

import { type TransformerFn } from '../types';

const graphqlTransformer: TransformerFn = async (value) => {
  return jsonToSchema({ jsonInput: value }).value;
};

export default graphqlTransformer;
