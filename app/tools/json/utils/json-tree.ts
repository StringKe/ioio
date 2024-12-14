export interface JsonTreeNode {
  paths: string[]; // 路径
  key?: string; // 节点的键名
  value?: any; // 节点的值

  isArray?: boolean; // 是否是数组
  isObject?: boolean; // 是否是对象
  isPrimitive?: boolean; // 是否是原始类型
  primitiveType?: 'string' | 'number' | 'boolean' | 'null' | 'undefined'; // 具体的原始类型

  isExpanded: boolean; // 是否展开
  isStart?: boolean; // 是否是开始节点
  isEnd?: boolean; // 是否是结束节点
  isFirst?: boolean; // 是否是第一个节点
  isLast?: boolean; // 是否是最后一个节点

  level: number; // 缩进层级
  length?: number; // 如果是数组或对象，其长度

  valueFormat?: 'url' | 'email' | 'date' | 'base64' | 'json' | 'plain'; // 新增：值的格式类型
}

export class JsonTree {
  nodes: JsonTreeNode[] = [];
  data: any;
  setNodes?: (nodes: JsonTreeNode[]) => void;

  constructor(
    data: any,
    options: {
      setNodes?: (nodes: JsonTreeNode[]) => void;
    } = {},
  ) {
    this.data = data;
    this.setNodes = options.setNodes;
    this.nodes = this.buildNodes(data);
    this.setNodes?.(this.nodes);
  }

  private buildNodes(data: any, parentPath: string[] = [], level: number = 0): JsonTreeNode[] {
    const nodes: JsonTreeNode[] = [];

    if (Array.isArray(data)) {
      // 数组开始节点
      nodes.push(
        this.createNode({
          paths: parentPath,
          isArray: true,
          isStart: true,
          level,
          length: data.length,
        }),
      );

      data.forEach((item, index) => {
        const currentPath = [...parentPath, index.toString()];
        const isLast = index === data.length - 1;

        if (typeof item === 'object' && item !== null) {
          nodes.push(...this.buildNodes(item, currentPath, level + 1));
        } else {
          nodes.push(
            this.createNode({
              paths: currentPath,
              value: item,
              isPrimitive: true,
              primitiveType: this.getPrimitiveType(item),
              valueFormat: this.detectValueFormat(item),
              isLast,
              level: level + 1,
            }),
          );
        }
      });

      if (data.length > 0) {
        nodes.push(
          this.createNode({
            paths: parentPath,
            isArray: true,
            isEnd: true,
            isLast: true,
            level,
          }),
        );
      }
    } else if (typeof data === 'object' && data !== null) {
      const entries = Object.entries(data);

      // 对象开始节点
      nodes.push(
        this.createNode({
          paths: parentPath,
          isObject: true,
          isStart: true,
          level,
          length: entries.length,
        }),
      );

      entries.forEach(([key, value], index) => {
        const currentPath = [...parentPath, key];
        const isLast = index === entries.length - 1;

        if (typeof value === 'object' && value !== null) {
          nodes.push(...this.buildNodes(value, currentPath, level + 1));
        } else {
          nodes.push(
            this.createNode({
              paths: currentPath,
              key,
              value,
              isPrimitive: true,
              primitiveType: this.getPrimitiveType(value),
              valueFormat: this.detectValueFormat(value),
              isLast,
              level: level + 1,
            }),
          );
        }
      });

      if (entries.length > 0) {
        nodes.push(
          this.createNode({
            paths: parentPath,
            isObject: true,
            isEnd: true,
            isLast: true,
            level,
          }),
        );
      }
    }

    return nodes;
  }

  private createNode(node: Partial<JsonTreeNode>): JsonTreeNode {
    return {
      paths: node.paths || [],
      key: node.key,
      value: node.value,
      isArray: node.isArray || false,
      isObject: node.isObject || false,
      isPrimitive: node.isPrimitive || false,
      primitiveType: node.primitiveType,
      valueFormat: node.valueFormat,
      isExpanded: true,
      isStart: node.isStart || false,
      isEnd: node.isEnd || false,
      isLast: node.isLast || false,
      level: node.level || 0,
      length: node.length,
    };
  }

  addNode(parentNode: JsonTreeNode, value: any, key?: string) {
    const newPath = [...parentNode.paths];
    if (parentNode.isArray) {
      newPath.push(this.getArrayLength(parentNode).toString());
    } else {
      newPath.push(key || `new-key-${Date.now()}`);
    }

    // 创建新节点
    const siblings = this.findChildNodes(parentNode);
    const newNode = this.createNode({
      paths: newPath,
      isLast: true,
      level: parentNode.level + 1,
    });

    // 更新之前的最后一个节点
    const lastSibling = siblings[siblings.length - 1];
    if (lastSibling) {
      lastSibling.isLast = false;
    }

    // 插入新节点
    const insertIndex = this.nodes.findIndex((n) => n.paths.length <= parentNode.paths.length) || this.nodes.length;
    this.nodes.splice(insertIndex, 0, newNode);
    this.setNodes?.(this.nodes);

    // 更新数据
    this.updateData(newPath, value);
    this.updateNodeFlags();

    return newNode;
  }

  private getArrayLength(node: JsonTreeNode): number {
    const arrayValue = this.getValueByPath(this.data, node.paths);
    return Array.isArray(arrayValue) ? arrayValue.length : 0;
  }

  getValueByPath(data: any, paths: string[]): any {
    let current = data;
    for (let i = 0; i < paths.length - 1; i++) {
      current = current[paths[i]];
    }
    return current[paths[paths.length - 1]];
  }

  removeNode(node: JsonTreeNode) {
    const nodeIndex = this.nodes.findIndex((n) => JSON.stringify(n.paths) === JSON.stringify(node.paths));

    if (nodeIndex !== -1) {
      // 移除节点及其所有子节点
      this.nodes = this.nodes.filter((n) => !n.paths.every((path, i) => node.paths[i] === path));
      this.setNodes?.(this.nodes);

      // 更新数据
      this.removeDataByPath(node.paths);
    }
  }

  private updateData(paths: string[], value: any) {
    let current = this.data;
    for (let i = 0; i < paths.length - 1; i++) {
      current = current[paths[i]];
    }
    current[paths[paths.length - 1]] = value;
  }

  private removeDataByPath(paths: string[]) {
    let current = this.data;
    for (let i = 0; i < paths.length - 1; i++) {
      current = current[paths[i]];
    }

    if (Array.isArray(current)) {
      current.splice(parseInt(paths[paths.length - 1]), 1);
    } else {
      delete current[paths[paths.length - 1]];
    }
  }

  // 添加新的工具法
  findParentNode(node: JsonTreeNode): JsonTreeNode | null {
    return this.nodes.find((n) => n.level === node.level - 1 && node.paths.slice(0, -1).every((path, i) => n.paths[i] === path)) || null;
  }

  findChildNodes(node: JsonTreeNode): JsonTreeNode[] {
    return this.nodes.filter(
      (n) => n.level === node.level + 1 && n.paths.slice(0, node.paths.length).every((path, i) => node.paths[i] === path),
    );
  }

  updateNodeFlags() {
    this.nodes.forEach((node, index) => {
      const prevNode = this.nodes[index - 1];
      const nextNode = this.nodes[index + 1];

      // 更新 isFirst 和 isLast
      if (prevNode?.level !== node.level) {
        node.isFirst = true;
      }
      if (nextNode?.level !== node.level) {
        node.isLast = true;
      }
    });
    this.setNodes?.(this.nodes);
  }

  // 获取可见节点
  private getVisibleNodes(): JsonTreeNode[] {
    const visibleNodes: JsonTreeNode[] = [];
    let skipUntilLevel: number | null = null;

    for (const node of this.nodes) {
      // 如果正在跳过折叠的节点
      if (skipUntilLevel !== null) {
        // 如果当前节点的层级小于等于跳过层级，说明已经跳过了所有子节点
        if (node.level <= skipUntilLevel) {
          skipUntilLevel = null;
        } else {
          // 否则继续跳过
          continue;
        }
      }

      // 跳过折叠节点的结束括号
      if (node.isEnd) {
        const parentNode = this.findParentNode(node);
        // 如果父节点未展开或不存在，跳过结束节点
        if (!parentNode?.isExpanded && node.level != 0) {
          continue;
        }

        const sameStartNode = this.findSameStartNode(node);
        if (sameStartNode && !sameStartNode.isExpanded && node.level != 0) {
          continue;
        }
      }

      // 添加当前节点
      visibleNodes.push(node);

      // 如果当前节点是未展开的数组或对象，开始跳过其子节点
      if ((node.isArray || node.isObject) && !node.isEnd && !node.isExpanded) {
        skipUntilLevel = node.level;
      }
    }

    return visibleNodes;
  }

  // 切换节点展开状态
  toggleExpand(node: JsonTreeNode) {
    // 只处理数组或对象的开始节点
    if ((!node.isArray && !node.isObject) || node.isEnd) {
      return;
    }

    // 切换展开状态
    node.isExpanded = !node.isExpanded;

    // 更新可见节点
    this.setNodes?.(this.getVisibleNodes());
  }

  // 根据路径设置节点展开状态
  setToggleExpand(paths: string[], isExpanded: boolean) {
    const node = this.findNodeByPath(paths);
    if (node) {
      node.isExpanded = isExpanded;
      this.setNodes?.(this.nodes);
    }
  }

  // 根据路径查找节点
  findNodeByPath(paths: string[]): JsonTreeNode | undefined {
    return this.nodes.find((n) => n.paths.length === paths.length && n.paths.every((p, i) => paths[i] === p));
  }

  // 新增：获取原始类型的辅助方法
  private getPrimitiveType(value: any): JsonTreeNode['primitiveType'] {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return undefined;
  }

  // 新增：检测值的格式类型
  private detectValueFormat(value: any): JsonTreeNode['valueFormat'] {
    if (typeof value !== 'string') return 'plain';

    try {
      // 检测 URL
      if (value.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/i)) {
        return 'url';
      }

      // 检测邮箱
      if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return 'email';
      }

      // 检测日期
      if (!isNaN(Date.parse(value)) && value.match(/^\d{4}-\d{2}-\d{2}|^\d{4}\/\d{2}\/\d{2}/)) {
        return 'date';
      }

      // 检测 Base64
      if (value.match(/^[A-Za-z0-9+/=]{4,}$/)) {
        try {
          atob(value);
          return 'base64';
        } catch {
          // 什么都不做
        }
      }

      // 检测 JSON 字符串
      if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
        JSON.parse(value);
        return 'json';
      }
    } catch {
      // 什么都不做
    }

    return 'plain';
  }

  // 查找当前节点的开始节点，也就是 object 和 array 的开始节点
  private findSameStartNode(node: JsonTreeNode): JsonTreeNode | null {
    const startNode = this.nodes.find((n) => n.paths.length === node.paths.length && n.paths.every((p, i) => node.paths[i] === p));
    if (startNode) {
      return startNode;
    }
    return null;
  }

  // 展开所有节点
  expandAll() {
    this.nodes.forEach((node) => {
      if ((node.isArray || node.isObject) && !node.isEnd) {
        node.isExpanded = true;
      }
    });
    this.setNodes?.(this.getVisibleNodes());
  }

  // 折叠所有节点，但保持最顶层展开
  collapseAll() {
    this.nodes.forEach((node) => {
      if ((node.isArray || node.isObject) && !node.isEnd) {
        // 只折叠非顶层节点（level > 0）
        node.isExpanded = node.level === 0;
      }
    });
    this.setNodes?.(this.getVisibleNodes());
  }

  // 展开到指定层级
  expandToLevel(level: number) {
    this.nodes.forEach((node) => {
      if ((node.isArray || node.isObject) && !node.isEnd) {
        node.isExpanded = node.level < level;
      }
    });
    this.setNodes?.(this.getVisibleNodes());
  }

  // 展开指定路径
  expandPath(paths: string[]) {
    for (let i = 0; i <= paths.length; i++) {
      const currentPath = paths.slice(0, i);
      const node = this.findNodeByPath(currentPath);
      if (node && (node.isArray || node.isObject) && !node.isEnd) {
        node.isExpanded = true;
      }
    }
    this.setNodes?.(this.getVisibleNodes());
  }

  // 获取当前展开状态
  getExpandState(): Record<string, boolean> {
    const state: Record<string, boolean> = {};
    this.nodes.forEach((node) => {
      if ((node.isArray || node.isObject) && !node.isEnd) {
        state[node.paths.join('/')] = node.isExpanded;
      }
    });
    return state;
  }

  // 恢复展开状态
  setExpandState(state: Record<string, boolean>) {
    this.nodes.forEach((node) => {
      if ((node.isArray || node.isObject) && !node.isEnd) {
        const path = node.paths.join('/');
        if (path in state) {
          node.isExpanded = state[path];
        }
      }
    });
    this.setNodes?.(this.getVisibleNodes());
  }

  updateNodeValue(node: JsonTreeNode, newValue: any) {
    this.updateData(node.paths, newValue);
    this.setNodes?.(this.nodes);
  }
}
