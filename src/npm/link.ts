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

export const link = (module: Module, target: string = ''): Promise<number> => {
    const pathToModule = submodules.path(module);

    linked.name = navigation.packages[module];

    return exec.exec(`npm link ${target}`, [], { cwd: pathToModule });
}

const didModuleDependsOn = (module: Module, deps: Module): boolean => {
    const pathToModule = submodules.path(module);
    const pathToPackageJson = path.join(pathToModule, 'package.json');

    const modulePackageJson = JSON.parse(fs.readFileSync(pathToPackageJson).toString());
    const didModuleHasDevModuleInDeps = navigation.packages[deps] in modulePackageJson.dependencies;

    return didModuleHasDevModuleInDeps;
}

export const linkDevModule = async (module: Module) => {
    if (!linked.name) {
        return Promise.resolve(0);
    }

    await link(module);

    return Promise.all(navigation.list.map((deps) => {
        if (!didModuleDependsOn(module, deps)) {
            return Promise.resolve(0);
        }

        return link(module, navigation.packages[deps]);
    }));

}