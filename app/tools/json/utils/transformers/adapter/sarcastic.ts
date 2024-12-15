import transform from 'transform-json-types';

import { type TransformerFn } from '../types';

const sarcasticTransformer: TransformerFn = async (value) => {
  const code = transform(value, {
    lang: 'sarcastic',
  });

  return `import is from "sarcastic";\n\n${code}`;
};

export default sarcasticTransformer;
