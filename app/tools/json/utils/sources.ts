import { t } from '@lingui/core/macro';
import _ from 'lodash';

import { type IAdapter } from './adapter/types';

export async function transformAdapter(type: string) {
  const handle = (await import(`./adapter/${type}`)) as { default: IAdapter };
  return handle.default;
}

export async function getTransformAdapters() {
  return [
    {
      type: 'json',
      name: 'JSON',
      adapter: await transformAdapter('json'),
    },
    {
      type: 'jsobj',
      name: 'JavaScript Object',
      adapter: await transformAdapter('jsobj'),
    },
    {
      type: 'jsonc',
      name: 'JSON with Comments',
      adapter: await transformAdapter('jsonc'),
    },
    {
      type: 'toml',
      name: 'TOML',
      adapter: await transformAdapter('toml'),
    },
    {
      type: 'json5',
      name: 'JSON5',
      adapter: await transformAdapter('json5'),
    },
    {
      type: 'typescript',
      name: 'TypeScript',
      adapter: await transformAdapter('ts'),
    },
    {
      type: 'javaclass',
      name: 'Java Class',
      adapter: await transformAdapter('javaclass'),
    },
    {
      type: 'yaml',
      name: 'YAML',
      adapter: await transformAdapter('yaml'),
    },
    {
      type: 'form',
      name: 'Form Data',
      adapter: await transformAdapter('form'),
    },
    {
      type: 'query',
      name: 'Query String',
      adapter: await transformAdapter('query'),
    },
  ];
}

export async function transformSource(source: string): Promise<{
  content: any;
  detectSourceType: string;
}> {
  const adapters = await getTransformAdapters();
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
