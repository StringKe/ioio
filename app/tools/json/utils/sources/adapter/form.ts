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
      if (!trimmed) return false;

      // 排除可能是 Base64 的情况
      if (/^[A-Za-z0-9+/]+=*$/.test(trimmed)) {
        return false;
      }

      // 检查基本格式是否符合 key=value 模式
      if (!/^(?:[^=&]+=(?:[^=&]*&)*[^=&]*)?$/.test(trimmed)) {
        return false;
      }

      // 确保至少有一个有效的 key=value 对
      const pairs = trimmed.split('&').filter(Boolean);
      if (pairs.length === 0) return false;

      // 验证每个键值对的格式
      return pairs.every((pair) => {
        // 检查是否包含等号
        if (!pair.includes('=')) return false;

        const [key] = pair.split('=');
        // 确保 key 不为空且是有效的表单字段名（只允许常见的字符）
        return key.length > 0 && /^[\w\-\.]+$/.test(key);
      });
    } catch (error) {
      return false;
    }
  },
};

export default formAdapter;
