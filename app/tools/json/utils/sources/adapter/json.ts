import { type IAdapter } from '../types';

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
      JSON.parse(source);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default jsonAdapter;
