import process from "node:process";
import path from 'node:path';

export const submodules = ['openapi-extension', 'client', 'yfm-docs'] as const;
export type Module = typeof submodules[number];
export const packages: Record<Module, string> = {
    "openapi-extension": '@diplodoc/openapi-extension',
    "yfm-docs": '@doc-tools/docs',
    client: '@diplodoc/client'
}

export const baseUrl = process.cwd();
export const doc = {
    input: path.join(baseUrl, 'project'),
    output: path.join(baseUrl, 'project-output')
}
export const nginx = {
    folder: '/home/v8tenko/v8tenko.tech/diplodoc',
    host: 'https://v8tenko.tech/diplodoc'
};