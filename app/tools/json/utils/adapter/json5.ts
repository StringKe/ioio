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
      const trimmed = source.trim();

      // 必须以 { 或 [ 开始，以 } 或 ] 结束
      if (!(/^\{.*\}$/.test(trimmed) || /^\[.*\]$/.test(trimmed))) {
        return false;
      }

      // 检查是否包含 JSON5 特有的特征
      const hasJson5Features =
        // 无引号键名
        /{\s*\w+\s*:/.test(trimmed) ||
        // 单引号字符串
        /'[^']*'/.test(trimmed) ||
        // 十六进制数字
        /0x[0-9a-fA-F]+/.test(trimmed) ||
        // 注释
        /\/\/|\/\*/.test(trimmed) ||
        // 尾随逗号
        /,\s*[}\]]/.test(trimmed) ||
        // 正无穷、负无穷或 NaN
        /\b(Infinity|-Infinity|NaN)\b/.test(trimmed);

      if (!hasJson5Features) {
        return false;
      }

      parse(source);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default json5Adapter;
