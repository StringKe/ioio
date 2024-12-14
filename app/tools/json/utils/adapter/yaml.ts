import { dump, load } from 'js-yaml';

import { type IAdapter } from './types';

// YAML 格式的基本特征正则表达式
const YAML_PATTERNS = [
  // key: value 格式
  /^[\s-]*[\w\s]+:\s*.+$/m,
  // 列表项 (- item)
  /^[\s-]*-\s+.+$/m,
  // 多行文本 (>、|)
  /^[\s-]*[\w\s]+:\s*[>|]$/m,
  // 缩进结构
  /^(\s{2,}).+$/m,
  // 注释
  /^[\s-]*#.+$/m,
];

// 检查字符串是否可能是 YAML 格式
function isPossibleYaml(source: string): boolean {
  // 如果包含大括号或方括号开头，可能是 JSON，跳过 YAML 检测
  if (/^\s*[{\[]/.test(source)) {
    return false;
  }

  // 检查是否包含 YAML 的基本特征
  const hasYamlFeatures = YAML_PATTERNS.some((pattern) => pattern.test(source));
  if (!hasYamlFeatures) {
    return false;
  }

  // 检查基本语法规则
  const lines = source.split('\n');
  let hasValidStructure = false;

  for (const line of lines) {
    // 跳过空行
    if (!line.trim()) continue;

    // 跳过注释行
    if (line.trim().startsWith('#')) continue;

    // 检查是否有基本的 key: value 结构或列表项
    if (/^[\s-]*[\w\s]+:\s*.+$/.test(line) || /^[\s-]*-\s+.+$/.test(line)) {
      hasValidStructure = true;
    }

    // 检查缩进是否是偶数个空格
    const indentation = line.match(/^\s*/)[0].length;
    if (indentation > 0 && indentation % 2 !== 0) {
      return false;
    }
  }

  return hasValidStructure;
}

const yamlAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      return load(source);
    } catch (error) {
      throw new Error('Invalid YAML format');
    }
  },
  deserialize: async (source: unknown) => {
    try {
      return dump(source);
    } catch (error) {
      throw new Error('Failed to convert to YAML');
    }
  },
  detect: async (source: string) => {
    // 首先使用正则进行预检查
    if (!isPossibleYaml(source)) {
      return false;
    }
    return true;
  },
};

export default yamlAdapter;
