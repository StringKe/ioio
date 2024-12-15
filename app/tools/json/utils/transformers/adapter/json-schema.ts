import { type TransformerFn } from '../types';

const jsonSchemaTransformer: TransformerFn = async (value) => {
  const { run } = await import('json_typegen_wasm');
  return run(
    'Root',
    value,
    JSON.stringify({
      output_mode: 'json_schema',
    }),
  );
};

export default jsonSchemaTransformer;
