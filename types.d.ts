declare module 'generate-schema' {
  export const bigquery: (value: any) => any;
  export const mongoose: (value: any) => any;
  export const mysql: (value: any) => any;
}

declare module 'json-to-go' {
  export default function jsonToGo(value: any): any;
}

declare module 'gofmt.js' {
  export default function gofmt(value: any): any;
}

declare module '@walmartlabs/json-to-simple-graphql-schema/lib' {
  export function jsonToSchema(value: any): any;
}

declare module 'transform-json-types' {
  export default function transform(value: any, options: any): any;
}
