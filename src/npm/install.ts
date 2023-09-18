import * as exec from '@actions/exec';

import submodules, { Module } from '../submodule';

export const install = (module: Module): Promise<number> => {
    submodules.open(module);

    return exec.exec('npm install');
}