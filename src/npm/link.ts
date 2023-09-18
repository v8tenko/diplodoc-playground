import * as exec from '@actions/exec';
import * as core from '@actions/core';

import fs from 'node:fs';
import path from 'node:path';

import submodules, { Module } from '../navigation';
import navigation from '../navigation';

type LinkModule = {
    name: string | null
} & Partial<Record<Module, true>>

export let linked: LinkModule = {
    name: null
}

export const link = (module: Module): Promise<number> => {
    if (linked[module]) {
        return Promise.resolve(0);
    }

    const pathToModule = submodules.path(module);

    if (!linked.name) {
        linked.name = navigation.packages[module];
    }

    linked[module] = true;

    return exec.exec(`npm link`, [], { cwd: pathToModule });
}

const linkTarget = (module: Module, target: string): Promise<number> => {
    const pathToModule = submodules.path(module);

    if (!linked[target]) {
        core.error(`unable to link ${target}: ${target} did not link yet`);
    }

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

    try {
        await link(module);
    } catch (error) {
        core.info(`linking error: unable to link ${module}: ${error}`)
    }

    return Promise.all(navigation.list.map((deps) => {
        if (!didModuleDependsOn(module, deps)) {
            return Promise.resolve(0);
        }

        return linkTarget(module, navigation.packages[deps]);
    }));

}