import { type TransformerFn } from '../types';

const zodTransformer: TransformerFn = async (value, options?: { rootName?: string }) => {
  const { jsonToZod } = await import('json-to-zod');
  return jsonToZod(JSON.parse(value), options?.rootName ?? 'schema', true);
};

export default zodTransformer;
