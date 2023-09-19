import process from "node:process";
import path from 'node:path';

export const submodules = ['openapi-extension', 'client', 'yfm-docs'] as const;
export type Module = typeof submodules[number];

export const mappings = {
   module: {
    "openapi-extension": '@diplodoc/openapi-extension',
    "yfm-docs": '@doc-tools/docs',
    client: '@diplodoc/client'
   },
   package: {
    '@diplodoc/openapi-extension': "openapi-extension",
    '@doc-tools/docs': "yfm-docs",
    '@diplodoc/client': 'client'
   }
} as const;

export type Package = typeof mappings.module[Module];

export const baseUrl = process.cwd();
export const doc = {
    input: path.join(baseUrl, 'project'),
    output: path.join(baseUrl, 'project-output')
}
