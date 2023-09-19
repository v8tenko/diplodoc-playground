import navigation, {Module, Package} from "../navigation";

import path from 'node:path';
import fs from 'node:fs';

type Dependencies = string[];
type LocalDependencies = Package[];
type Modules = Module[];


type Cache = {
    all: Partial<Record<Module, Dependencies>>,
    local: Partial<Record<Module, Modules>>
}

const cache: Cache = {
    all: {},
    local: {}
};

const dependencies = (module: Module): Dependencies => {
    if (cache.all[module]) {
        return cache.all[module]!;
    }

    const pathToModule = navigation.path(module);
    const pathToPackageJson = path.join(pathToModule, 'package.json');

    const modulePackageJson = JSON.parse(fs.readFileSync(pathToPackageJson).toString());

    cache.all[module] = Object.keys(modulePackageJson.dependencies);

    return cache.all[module]!;
};

export const localDependencies = (module: Module): Modules => {
    if (cache.local[module]) {
        return cache.local[module]!;
    }

    const deps = dependencies(module);

    // @ts-ignore
    cache.local[module] = deps.filter((dep) => navigation.mappings.package[dep]).map((dep) => navigation.mappings.package[dep])

    return cache.local[module]!;
};

type DependenciesTreeNode = {
    parents: Modules;
    dependsOn: Modules;
    links: number;
};

type DependenciesTree = {
    tree: {
        [module in Module]: DependenciesTreeNode;
    },
    leafs: Modules;
}

export const buildDependeciesTree = (): DependenciesTree => {
    const tree = Object.fromEntries(
        navigation.list.map((dep) => [dep, { dependsOn: [], parents: [], links: 0 } as DependenciesTreeNode])
    );

    navigation.list.forEach((module) => {
        const localDeps = localDependencies(module);

        localDeps.forEach((deps) => {
            tree[module].dependsOn.push(deps);
            tree[module].links++;

            tree[deps].parents.push(module);
        })
    });

    const leafs = navigation.list.filter((name) => tree[name].dependsOn.length === 0);

    return {
        tree: tree as DependenciesTree['tree'],
        leafs
    };
}