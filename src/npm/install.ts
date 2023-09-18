import * as exec from '@actions/exec';

import submodules, { Module } from '../navigation';

export const install = (module: Module): Promise<number> => {
    const pathToModule = submodules.path(module);

    return exec.exec('npm install', [], { cwd: pathToModule });
}