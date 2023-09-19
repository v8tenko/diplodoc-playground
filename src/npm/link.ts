import * as exec from '@actions/exec';
import * as core from '@actions/core';

import fs from 'node:fs';
import path from 'node:path';

import navigation, {Module} from '../navigation';
import {localDependencies} from '.';

type LinkModule = Partial<Record<Module, true>>

export let linked: LinkModule = {}

export const link = (module: Module): Promise<number> => {
    if (linked[module]) {
        return Promise.resolve(0);
    }

    const pathToModule = navigation.path(module);

    linked[module] = true;

    return exec.exec(`npm link`, [], { cwd: pathToModule });
}

export const linkWith = (module: Module, target: Module): Promise<number> => {
    const pathToModule = navigation.path(module);
    const name = navigation.mappings.module[target];

    if (!linked[target]) {
        core.error(`unable to link ${target}: ${name} did not link yet`);
    }

    return exec.exec(`npm link ${name}`, [], { cwd: pathToModule });
};