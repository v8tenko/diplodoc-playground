import process from "node:process";

export const submodules = ['openapi-extension', 'client', 'yfm-docs'] as const;
export type Module = typeof submodules[number];

export const baseUrl = process.cwd();