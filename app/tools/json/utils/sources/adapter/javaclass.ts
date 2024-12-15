import { BaseJavaCstVisitorWithDefaults, parse } from 'java-parser';

import { type IAdapter } from '../types';

// 创建访问者来解析 Java 类结构
class JavaClassVisitor extends BaseJavaCstVisitorWithDefaults {
  results: Record<string, any> = {};
  currentClass = '';

  constructor() {
    super();
  }

  visitClassDeclaration(ctx: any) {
    if (ctx.typeIdentifier) {
      this.currentClass = ctx.typeIdentifier[0].image;
      this.results[this.currentClass] = {
        type: 'object',
        properties: {},
        required: [],
      };
    }
    if (ctx.classBody) {
      this.visit(ctx.classBody);
    }
  }

  visitFieldDeclaration(ctx: any) {
    if (ctx.fieldModifier) {
      const isPrivate = ctx.fieldModifier.some((mod: any) => mod.children.Private !== undefined);
      if (isPrivate) return;
    }

    const type = this.getTypeFromDeclaration(ctx.unannType[0]);
    const variables = ctx.variableDeclaratorList[0].children.variableDeclarator;

    variables.forEach((variable: any) => {
      const fieldName = variable.children.variableDeclaratorId[0].children.Identifier[0].image;
      this.results[this.currentClass].properties[fieldName] = {
        type: this.convertJavaTypeToJsonType(type),
      };
      this.results[this.currentClass].required.push(fieldName);
    });
  }

  private getTypeFromDeclaration(typeCtx: any): string {
    if (typeCtx.children.unannPrimitiveType) {
      return (
        typeCtx.children.unannPrimitiveType[0].children.numericType?.[0].children.integralType?.[0].image ||
        typeCtx.children.unannPrimitiveType[0].children.numericType?.[0].children.floatingPointType?.[0].image ||
        typeCtx.children.unannPrimitiveType[0].children.Boolean?.[0].image
      );
    }
    if (typeCtx.children.unannReferenceType) {
      const classType = typeCtx.children.unannReferenceType[0].children.unannClassOrInterfaceType[0];
      return classType.children.unannClassType[0].children.Identifier[0].image;
    }
    return 'Object';
  }

  private convertJavaTypeToJsonType(javaType: string): string {
    const typeMap: Record<string, string> = {
      byte: 'number',
      short: 'number',
      int: 'number',
      long: 'number',
      float: 'number',
      double: 'number',
      boolean: 'boolean',
      char: 'string',
      String: 'string',
      List: 'array',
      Set: 'array',
      Map: 'object',
    };
    return typeMap[javaType] || 'object';
  }
}

const javaclassAdapter: IAdapter = {
  serialize: async (source: string) => {
    try {
      const cst = parse(source);
      const visitor = new JavaClassVisitor();
      visitor.visit(cst);
      return visitor.results;
    } catch (error) {
      throw new Error('Invalid Java class definition');
    }
  },

  deserialize: async (source: unknown) => {
    try {
      const obj = source as Record<string, any>;
      let result = '';

      Object.entries(obj).forEach(([className, schema]) => {
        result += `public class ${className} {\n`;

        if (schema.properties) {
          Object.entries(schema.properties).forEach(([propName, propSchema]: [string, any]) => {
            const javaType = convertJsonTypeToJavaType(propSchema.type);
            result += `    private ${javaType} ${propName};\n`;

            // 生成 getter
            result += `    public ${javaType} get${capitalizeFirst(propName)}() {\n`;
            result += `        return ${propName};\n`;
            result += `    }\n\n`;

            // 生成 setter
            result += `    public void set${capitalizeFirst(propName)}(${javaType} ${propName}) {\n`;
            result += `        this.${propName} = ${propName};\n`;
            result += `    }\n\n`;
          });
        }

        result += '}\n';
      });

      return result;
    } catch (error) {
      throw new Error('Failed to convert to Java class');
    }
  },

  detect: async (source: string) => {
    try {
      const trimmed = source.trim();
      // 检查是否是 Java 类定义
      return /^public\s+class\s+\w+\s*\{[\s\S]*\}/.test(trimmed);
    } catch (error) {
      return false;
    }
  },
};

// 辅助函数：将 JSON Schema 类型转换为 Java 类型
function convertJsonTypeToJavaType(jsonType: string): string {
  switch (jsonType) {
    case 'string':
      return 'String';
    case 'number':
      return 'double';
    case 'integer':
      return 'int';
    case 'boolean':
      return 'boolean';
    case 'array':
      return 'List<Object>';
    case 'object':
    default:
      return 'Object';
  }
}

// 辅助函数：首字母大写
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default javaclassAdapter;
