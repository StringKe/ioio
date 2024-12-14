import { type IAdapter } from './types';

const queryAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      const result: Record<string, any> = {};
      // 移除开头可能存在的 ? 号
      const query = source.startsWith('?') ? source.slice(1) : source;
      const searchParams = new URLSearchParams(query);

      searchParams.forEach((value, key) => {
        // 尝试解析数组格式 (key[]=value)
        if (key.endsWith('[]')) {
          const arrayKey = key.slice(0, -2);
          if (!result[arrayKey]) {
            result[arrayKey] = [];
          }
          result[arrayKey].push(value);
        } else {
          // 尝试解析数字
          if (/^\d+$/.test(value)) {
            result[key] = parseInt(value, 10);
          } else if (/^\d*\.\d+$/.test(value)) {
            result[key] = parseFloat(value);
          } else if (value === 'true') {
            result[key] = true;
          } else if (value === 'false') {
            result[key] = false;
          } else if (value === 'null') {
            result[key] = null;
          } else {
            result[key] = value;
          }
        }
      });

      return result;
    } catch (error) {
      throw new Error('Invalid query string format');
    }
  },

  deserialize: async (source: unknown) => {
    try {
      const obj = source as Record<string, any>;
      const searchParams = new URLSearchParams();

      Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            searchParams.append(`${key}[]`, String(item));
          });
        } else {
          searchParams.append(key, String(value));
        }
      });

      return '?' + searchParams.toString();
    } catch (error) {
      throw new Error('Failed to convert to query string');
    }
  },

  detect: async (source: string) => {
    try {
      const trimmed = source.trim();
      // 检查是否以 ? 开头（可选）并且符合查询字符串格式
      return /^(\?)?[^=&]+=[^=&]+(&[^=&]+=[^=&]+)*$/.test(trimmed);
    } catch (error) {
      return false;
    }
  },
};

export default queryAdapter;
