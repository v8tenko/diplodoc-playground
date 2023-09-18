import * as exec from '@actions/exec';

import { spawnSync } from 'node:child_process';

import { baseUrl } from '../navigation/constants';

export const update = async () => {
    spawnSync(`cd ${baseUrl}`);

    return exec.exec('git submodule update --init --recursive');
}