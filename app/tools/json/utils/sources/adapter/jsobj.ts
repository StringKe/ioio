import { type IAdapter } from '../types';

const jsobjAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      // 移除首尾可能存在的括号和空白
      let processedSource = source.trim();
      if (processedSource.startsWith('(') && processedSource.endsWith(')')) {
        processedSource = processedSource.slice(1, -1);
      }

      // 预处理 JavaScript 对象
      processedSource = processedSource
        // 处理没有引号的键名
        .replace(/(\b[a-zA-Z_$][a-zA-Z0-9_$]*\s*)(?=:)/g, '"$1"')
        // 处理单引号字符串
        .replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"')
        // 处理末尾的逗号
        .replace(/,(\s*[}\]])/g, '$1')
        // 处理多行注释
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // 处理单行注释
        .replace(/\/\/.*/g, '');

      return JSON.parse(processedSource);
    } catch (error) {
      throw new Error('Invalid JavaScript object literal');
    }
  },

  deserialize: async (source: unknown) => {
    try {
      const jsonString = JSON.stringify(source, null, 2);
      return (
        jsonString
          // 将双引号的键名转换为无引号形式（仅对合法的标识符）
          .replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g, '$1:')
          // 将剩余的双引号转换为单引号
          .replace(/"/g, "'")
      );
    } catch (error) {
      throw new Error('Failed to convert to JavaScript object literal');
    }
  },

  detect: async (source: string) => {
    try {
      const trimmed = source.trim();

      // 检查是否是变量声明
      if (/^(const|let|var)\s+\w+\s*=/.test(trimmed)) {
        return false; // 这种情况应该由 ts 适配器处理
      }

      // 检查基本结构
      if (!(/^\{[\s\S]*\}$/.test(trimmed) || /^\[[\s\S]*\]$/.test(trimmed))) {
        return false;
      }

      // 检查是否包含 JavaScript 对象特有的特征
      const hasJsObjectFeatures =
        // 无引号键名
        /\b[a-zA-Z_$][a-zA-Z0-9_$]*\s*:/.test(trimmed) ||
        // 单引号字符串
        /'[^']*'/.test(trimmed) ||
        // 末尾逗号
        /,\s*[}\]]/.test(trimmed) ||
        // 注释
        /\/\/|\/\*/.test(trimmed);

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
