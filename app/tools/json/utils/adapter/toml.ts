import { parse, stringify } from 'smol-toml';

import { type IAdapter } from './types';

const tomlAdapter: IAdapter = {
  serialize: async (source: string) => {
    return parse(source);
  },
  deserialize: async (source: unknown) => {
    return stringify(source);
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

export default tomlAdapter;
