import * as exec from '@actions/exec';

import { Module, baseUrl } from './constants';

export const path = (module: Module): string => {
    return `${baseUrl}/${module}`;
}
