import { t } from '@lingui/core/macro';
import _ from 'lodash';

import { type IAdapter } from './types';

export async function getSourceAdapter(type: string) {
  const handle = (await import(`./adapter/${type}`)) as { default: IAdapter };
  return handle.default;
}

export async function getSourceAdapters() {
  return [
    {
      type: 'typescript',
      name: 'TypeScript',
      adapter: await getSourceAdapter('ts'),
    },
    {
      type: 'javaclass',
      name: 'Java Class',
      adapter: await getSourceAdapter('javaclass'),
    },
    {
      type: 'toml',
      name: 'TOML',
      adapter: await getSourceAdapter('toml'),
    },
    {
      type: 'yaml',
      name: 'YAML',
      adapter: await getSourceAdapter('yaml'),
    },
    {
      type: 'jsonc',
      name: 'JSON with Comments',
      adapter: await getSourceAdapter('jsonc'),
    },
    {
      type: 'json5',
      name: 'JSON5',
      adapter: await getSourceAdapter('json5'),
    },
    {
      type: 'jsobj',
      name: 'JavaScript Object',
      adapter: await getSourceAdapter('jsobj'),
    },
    {
      type: 'json',
      name: 'JSON',
      adapter: await getSourceAdapter('json'),
    },
    {
      type: 'form',
      name: 'Form Data',
      adapter: await getSourceAdapter('form'),
    },
    {
      type: 'query',
      name: 'Query String',
      adapter: await getSourceAdapter('query'),
    },
  ];
}

export async function parserSource(source: string): Promise<{
  content: any;
  detectSourceType: string;
}> {
  const adapters = await getSourceAdapters();
  for (const adapter of adapters) {
    const detect = await adapter.adapter.detect(source);
    console.log(`${adapter.type} adapter detect:`, detect);
    if (detect) {
      try {
        const json = await adapter.adapter.serialize(source);
        console.log(`${adapter.type} adapter serialize:`, json);

        // 基础类型需要包装成对象
        if (_.isObject(json) || _.isArray(json)) {
          return {
            content: json,
            detectSourceType: adapter.type,
          };
        } else {
          return {
            content: { value: json },
            detectSourceType: adapter.type,
          };
        }
      } catch (error) {
        console.error(`${adapter.type} adapter error:`, error);
      }
    }
  }

  throw new Error(t`No adapter can detect the source`);
}
