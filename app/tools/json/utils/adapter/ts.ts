import * as ts from 'typescript';

import { type IAdapter } from './types';

const tsAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      // 创建一个虚拟的 TypeScript 源文件
      const sourceFile = ts.createSourceFile('temp.ts', source, ts.ScriptTarget.Latest, true);

      const result: Record<string, any> = {};

      // 遍历源文件中的所有语句
      sourceFile.statements.forEach((statement) => {
        if (ts.isVariableStatement(statement)) {
          statement.declarationList.declarations.forEach((declaration) => {
            if (ts.isIdentifier(declaration.name) && declaration.initializer) {
              // 获取变量名
              const varName = declaration.name.text;

              // 如果是对象字面量表达式
              if (ts.isObjectLiteralExpression(declaration.initializer)) {
                result[varName] = evaluateObjectLiteral(declaration.initializer);
              }
            }
          });
        }
      });

      return result;
    } catch (error) {
      throw new Error('Invalid TypeScript object declarations');
    }
  },

  deserialize: async (source: unknown) => {
    try {
      const obj = source as Record<string, any>;
      let result = '';

      // 将每个键值对转换为 TypeScript 变量声明
      Object.entries(obj).forEach(([varName, value]) => {
        result += `const ${varName} = ${JSON.stringify(value, null, 2)};\n\n`;
      });

      return result;
    } catch (error) {
      throw new Error('Failed to convert to TypeScript declarations');
    }
  },

  detect: async (source: string) => {
    try {
      const trimmed = source.trim();
      // 检查是否包含 TypeScript 变量声明
      return /^(const|let|var)\s+\w+(\s*:\s*\w+)?\s*=\s*\{[\s\S]*\}/.test(trimmed);
    } catch (error) {
      return false;
    }
  },
};

// 辅助函数：评估对象字面量
function evaluateObjectLiteral(node: ts.ObjectLiteralExpression): any {
  const result: any = {};

  node.properties.forEach((prop) => {
    if (ts.isPropertyAssignment(prop)) {
      const name = prop.name.getText();
      const value = evaluateExpression(prop.initializer);
      result[name] = value;
    }
  });

  return result;
}

// 辅助函数：评估表达式
function evaluateExpression(node: ts.Expression): any {
  if (ts.isStringLiteral(node)) {
    return node.text;
  } else if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  } else if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  } else if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(evaluateExpression);
  } else if (ts.isObjectLiteralExpression(node)) {
    return evaluateObjectLiteral(node);
  }
  return undefined;
}

export default tsAdapter;
