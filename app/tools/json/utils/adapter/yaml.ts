import { dump, load } from 'js-yaml';

import { type IAdapter } from './types';

const yamlAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      return load(source);
    } catch (error) {
      throw new Error('Invalid YAML format');
    }
  },
  deserialize: async (source: unknown) => {
    try {
      return dump(source);
    } catch (error) {
      throw new Error('Failed to convert to YAML');
    }
  },
  detect: async (source: string) => {
    try {
      load(source);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default yamlAdapter;
