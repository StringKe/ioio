import queryString from 'query-string';

import { type IAdapter } from '../types';

const queryAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      return queryString.parse(source as string);
    } catch (error) {
      throw new Error('Invalid query string format');
    }
  },

  deserialize: async (source: unknown) => {
    try {
      return queryString.stringify(source as Record<string, any>);
    } catch (error) {
      throw new Error('Failed to convert to query string');
    }
  },

  detect: async (source: string) => {
    try {
      queryString.parse(source);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default queryAdapter;
