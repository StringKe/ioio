import { parse } from 'jsonc-parser';

import { type IAdapter } from '../types';

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
      const trimmed = source.trim();
      // 必须以 { 或 [ 开始，以 } 或 ] 结束
      if (!(/^\{.*\}$/.test(trimmed) || /^\[.*\]$/.test(trimmed))) {
        return false;
      }

      // 检查是否包含 JSONC 特有的特征
      const hasJsoncFeatures =
        // 包含注释
        /\/\/|\/\*/.test(trimmed) ||
        // 包含尾随逗号
        /,\s*[}\]]/.test(trimmed);

      if (!hasJsoncFeatures) {
        // 如果没有 JSONC 特有特征，则不是 JSONC
        return false;
      }

      parse(source);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default jsoncAdapter;
