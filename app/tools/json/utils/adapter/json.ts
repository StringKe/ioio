import { type IAdapter } from './types';

const jsonAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      return JSON.parse(source);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  },
  deserialize: async (source: unknown) => {
    try {
      return JSON.stringify(source);
    } catch (error) {
      throw new Error('Failed to stringify JSON');
    }
  },
  detect: async (source: string) => {
    try {
      const trimmed = source.trim();
      if (!(/^\{.*\}$/.test(trimmed) || /^\[.*\]$/.test(trimmed))) {
        return false;
      }
      if (/\/\/|\/\*/.test(trimmed)) {
        return false;
      }
      if (/,\s*[}\]]/.test(trimmed)) {
        return false;
      }
      if (/{\s*\w+\s*:/.test(trimmed)) {
        return false;
      }
      JSON.parse(source);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default jsonAdapter;
