import * as exec from '@actions/exec';

import { Module, baseUrl } from './constants';

export const open = async (module: Module): Promise<boolean> => {
    exec.exec(`cd ${baseUrl}/${module}`);

    return true;
}
