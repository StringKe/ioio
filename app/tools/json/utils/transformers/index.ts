import { type TransformerFn } from './types';

export async function transformsAdapter(type: string) {
  const handle = (await import(`./adapter/${type}`)) as { default: TransformerFn };
  return handle.default;
}

export function getTransformers(): {
  type: string;
  name: string;
  description: string;
  language: string;
}[] {
  return [
    {
      type: 'big-query',
      name: 'BigQuery',
      description: 'Transform JSON to BigQuery schema',
      language: 'json',
    },
    {
      type: 'flow',
      name: 'Flow',
      description: 'Transform JSON to Flow type definitions',
      language: 'typescript',
    },
    {
      type: 'go-bson',
      name: 'Go BSON',
      description: 'Transform JSON to Go BSON',
      language: 'go',
    },
    {
      type: 'go',
      name: 'Go',
      description: 'Transform JSON to Go struct',
      language: 'go',
    },
    {
      type: 'graphql',
      name: 'GraphQL',
      description: 'Transform JSON to GraphQL schema',
      language: 'graphql',
    },
    {
      type: 'io-ts',
      name: 'io-ts',
      description: 'Transform JSON to io-ts type definitions',
      language: 'typescript',
    },
    {
      type: 'java',
      name: 'Java',
      description: 'Transform JSON to Java classes',
      language: 'java',
    },
    {
      type: 'jsdoc',
      name: 'JSDoc',
      description: 'Transform JSON to JSDoc type definitions',
      language: 'typescript',
    },
    {
      type: 'json-schema',
      name: 'JSON Schema',
      description: 'Transform JSON to JSON Schema',
      language: 'json',
    },
    {
      type: 'kotlin',
      name: 'Kotlin',
      description: 'Transform JSON to Kotlin data classes',
      language: 'kotlin',
    },
    {
      type: 'mongoose',
      name: 'Mongoose',
      description: 'Transform JSON to Mongoose schema',
      language: 'javascript',
    },
    {
      type: 'mysql',
      name: 'MySQL',
      description: 'Transform JSON to MySQL schema',
      language: 'sql',
    },
    {
      type: 'rust-serde',
      name: 'Rust Serde',
      description: 'Transform JSON to Rust Serde structs',
      language: 'rust',
    },
    {
      type: 'sarcastic',
      name: 'Sarcastic',
      description: 'Transform JSON to Sarcastic type definitions',
      language: 'typescript',
    },
    {
      type: 'scala-case-class',
      name: 'Scala Case Class',
      description: 'Transform JSON to Scala Case Class',
      language: 'scala',
    },
    {
      type: 'toml',
      name: 'TOML',
      description: 'Transform JSON to TOML',
      language: 'toml',
    },
    {
      type: 'typescript',
      name: 'TypeScript',
      description: 'Transform JSON to TypeScript type definitions',
      language: 'typescript',
    },
    {
      type: 'yaml',
      name: 'YAML',
      description: 'Transform JSON to YAML',
      language: 'yaml',
    },
    {
      type: 'zod',
      name: 'Zod',
      description: 'Transform JSON to Zod schema',
      language: 'typescript',
    },
  ];
}
