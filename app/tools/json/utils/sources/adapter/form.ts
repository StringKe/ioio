import { type IAdapter } from '../types';

const formAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      const result: Record<string, string> = {};
      const formData = new URLSearchParams(source);

      formData.forEach((value, key) => {
        result[key] = value;
      });

      return result;
    } catch (error) {
      throw new Error('Invalid form data format');
    }
  },

  deserialize: async (source: unknown) => {
    try {
      const obj = source as Record<string, any>;
      const formData = new URLSearchParams();

      Object.entries(obj).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      return formData.toString();
    } catch (error) {
      throw new Error('Failed to convert to form data');
    }
  },

  detect: async (source: string) => {
    try {
      const trimmed = source.trim();
      // 检查是否符合 key=value 格式
      return /^(?:[^=&]+=(?:[^=&]*&)*[^=&]*)?$/.test(trimmed);
    } catch (error) {
      return false;
    }
  },
};

export default formAdapter;
