import { type TransformerFn } from '../types';

const typescriptTransformer: TransformerFn = async (
  value,
  options?: {
    alias?: boolean;
  },
) => {
  const { run } = await import('json_typegen_wasm');
  return run(
    'Root',
    value,
    JSON.stringify({
      output_mode: !options?.alias ? 'typescript/typealias' : 'typescript',
    }),
  );
};

export default typescriptTransformer;
