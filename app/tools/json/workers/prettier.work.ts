import { type BuiltInParserName } from 'prettier';
import prettier from 'prettier/standalone';

const prettierParsers = {
  css: 'postcss',
  javascript: 'babel',
  jsx: 'babel',
  svg: 'html',
  xml: 'html',
  typescript: 'typescript',
};

const supportedLanguages = [
  'json',
  'babylon',
  'html',
  'postcss',
  'graphql',
  'markdown',
  'yaml',
  'typescript',
  'flow',
  ...Object.keys(prettierParsers),
];

const plugins = [
  require('prettier/parser-babylon'),
  require('prettier/parser-html'),
  require('prettier/parser-postcss'),
  require('prettier/parser-graphql'),
  require('prettier/parser-markdown'),
  require('prettier/parser-yaml'),
  require('prettier/parser-flow'),
  require('prettier/parser-typescript'),
];

async function prettify(language: string, value: string) {
  let result;

  if (!supportedLanguages.includes(language)) return value;

  if (language === 'json') {
    result = JSON.stringify(JSON.parse(value), null, 2);
  } else {
    result = prettier.format(value, {
      parser: prettierParsers[language as keyof typeof prettierParsers] || language,
      plugins,
      semi: false,
    });
  }

  return result;
}

interface Data {
  data: {
    payload: {
      value: string;
      language: BuiltInParserName;
    };
    id: string | number;
  };
}

const _self = self as any;

_self.onmessage = ({
  data: {
    payload: { value, language },
    id,
  },
}: Data) => {
  (async function () {
    try {
      const payload = await prettify(language, value);

      _self.postMessage({
        id,
        payload,
      });
    } catch (e: any) {
      _self.postMessage({
        id,
        err: e.message,
      });
    }
  })();
};
