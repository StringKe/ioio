import { type IAdapter } from './types';

const jsobjAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      // 移除首尾可能存在的括号
      let processedSource = source.trim();
      if (processedSource.startsWith('(') && processedSource.endsWith(')')) {
        processedSource = processedSource.slice(1, -1);
      }

      // 替换 JavaScript 对象中的特殊语法为标准 JSON 格式
      processedSource = processedSource
        // 替换没有引号的键名
        .replace(/(\b\w+)(?=\s*:)/g, '"$1"')
        // 替换单引号为双引号
        .replace(/'/g, '"')
        // 处理末尾的逗号
        .replace(/,(\s*[}\]])/g, '$1');

      return JSON.parse(processedSource);
    } catch (error) {
      throw new Error('Invalid JavaScript object literal');
    }
  },

  deserialize: async (source: unknown) => {
    try {
      // 将对象转换为格式化的字符串，使用单引号和无引号的键名
      const jsonString = JSON.stringify(source, null, 2);
      return (
        jsonString
          // 将双引号的键名转换为无引号形式（仅对简单键名）
          .replace(/"(\w+)":/g, '$1:')
          // 将剩余的双引号转换为单引号
          .replace(/"/g, "'")
      );
    } catch (error) {
      throw new Error('Failed to convert to JavaScript object literal');
    }
  },

  detect: async (source: string) => {
    try {
      // 检查是否是有效的 JavaScript 对象字面量
      const trimmed = source.trim();

      // 检查基本结构
      if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
        return false;
      }

      // 检查是否包含 JavaScript 对象特有的模式
      const hasJsObjectFeatures =
        // 无引号键名
        /\b\w+\s*:/.test(trimmed) ||
        // 单引号字符串
        /'[^']*'/.test(trimmed) ||
        // 末尾逗号
        /,\s*[}\]]/.test(trimmed);

      if (!hasJsObjectFeatures) {
        return false;
      }

      // 尝试序列化来验证
      await jsobjAdapter.serialize(source);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default jsobjAdapter;
