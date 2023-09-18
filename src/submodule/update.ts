import * as exec from '@actions/exec';

import process from 'node:process';

import { baseUrl } from './constants';

export const update = async () => {
    exec.exec(`cd ${baseUrl}`);

    return exec.exec('git submodule update --init --recursive');
}