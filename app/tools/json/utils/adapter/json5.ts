import parse from 'json5/lib/parse.js';
import stringify from 'json5/lib/stringify.js';

import { type IAdapter } from './types';

const json5Adapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      return parse(source);
    } catch (error) {
      throw new Error('Invalid JSON5 format');
    }
  },
  deserialize: async (source: unknown) => {
    try {
      return stringify(source, null, 2);
    } catch (error) {
      throw new Error('Failed to convert to JSON5');
    }
  },
  detect: async (source: string) => {
    try {
      parse(source);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default json5Adapter;
