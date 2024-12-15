import { type TransformerFn } from '../types';

const rustSerdeTransformer: TransformerFn = async (value) => {
  const { run } = await import('json_typegen_wasm');
  return run(
    'Root',
    value,
    JSON.stringify({
      output_mode: 'rust',
      property_name_format: 'camelCase',
    }),
  );
};

export default rustSerdeTransformer;
