export interface IAdapter {
  // 负责将源数据转换为 JSON 对象
  serialize: (source: string, options?: any) => Promise<unknown>;
  // 负责将 JSON 对象转换为源数据
  deserialize: (source: unknown, options?: any) => Promise<string>;
  // 负责检测源数据是否可以被转换为 JSON 对象
  detect: (source: string, options?: any) => Promise<boolean>;
}
