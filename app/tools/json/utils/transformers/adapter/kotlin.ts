import { type TransformerFn } from '../types';

const kotlinTransformer: TransformerFn = async (value) => {
  const { run } = await import('json_typegen_wasm');
  return run(
    'Root',
    value,
    JSON.stringify({
      output_mode: 'kotlin',
    }),
  );
};

export default kotlinTransformer;
