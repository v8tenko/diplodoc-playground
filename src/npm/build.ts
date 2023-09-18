import * as exec from '@actions/exec';
import submodules, { Module } from '../navigation';

export const build = (module: Module): Promise<number> => {
    const pathToModule = submodules.path(module);

    return exec.exec('npm run build', [], {cwd: pathToModule})
}