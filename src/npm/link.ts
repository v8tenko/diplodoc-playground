import * as exec from '@actions/exec';
import * as core from '@actions/core';

import fs from 'node:fs';
import path from 'node:path';

import submodules, { Module } from '../navigation';
import navigation from '../navigation';

type LinkModule = {
    name: string | null
}

export let linked: LinkModule = {
    name: null
}

export const link = (module: Module): Promise<number> => {
    const pathToModule = submodules.path(module);

    linked.name = navigation.packages[module];

    return exec.exec('npm link', [], { cwd: pathToModule });
}

export const linkDevModule = (module: Module): Promise<number> => {
    const pathToModule = submodules.path(module);
    const pathToPackageJson = path.join(pathToModule, 'package.json');

    if (!linked.name) {
        return Promise.resolve(0);
    }

    const modulePackageJson = JSON.parse(fs.readFileSync(pathToPackageJson).toString());
    const didModuleHasDevModuleInDeps = linked.name in modulePackageJson.dependencies;

    if (!didModuleHasDevModuleInDeps) {
        core.info(`${module} did not depend on ${linked.name}. skiping`)
        return Promise.resolve(0);
    }

    core.info(`link ${linked.name} to ${module}...`)
    return exec.exec(`npm link ${linked.name}`, [], { cwd: pathToModule });
}