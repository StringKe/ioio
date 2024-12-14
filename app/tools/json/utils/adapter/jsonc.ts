import { parse } from 'jsonc-parser';

import { type IAdapter } from './types';

const jsoncAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      return parse(source);
    } catch (error) {
      throw new Error('Invalid JSONC format');
    }
  },
  deserialize: async (source: unknown) => {
    try {
      return JSON.stringify(source, null, 2);
    } catch (error) {
      throw new Error('Failed to convert to JSONC');
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

export default jsoncAdapter;
