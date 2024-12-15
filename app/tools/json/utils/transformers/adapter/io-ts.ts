import transform from 'transform-json-types';

import { type TransformerFn } from '../types';

const ioTsTransformer: TransformerFn = async (value) => {
  const code = transform(value, {
    lang: 'io-ts',
  });

  return `import * as t from "io-ts";\n\n${code}`;
};

export default ioTsTransformer;
