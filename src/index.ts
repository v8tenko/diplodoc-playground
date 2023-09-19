import * as core from '@actions/core';
import * as github from '@actions/github';
import * as io from '@actions/io';

import git from './git';
import npm from './npm';
import navigation, {Module} from './navigation';
import pr from './pr';

import {buildDoc, deployDoc} from './doc';

import 'dotenv/config';

export const run = async () => {
    core.info('syncing submodules...')
    await git.update();

    if (true || pr.isDevRepository()) {
        const module = 'openapi-extension' || pr.repository() as Module;
        const branch = 'coloring' || pr.branch();

        git.checkout(module, branch);
        git.pull(module);
        
        await npm.install(module);
    }

    core.info('prepraring modules...');
    await Promise.all(navigation.list.map(npm.install));

    const {tree, leafs} = npm.buildDependeciesTree();
    const linkQueue = leafs;

    while (linkQueue.length) {
        const module = linkQueue.shift()!;
        const {dependsOn, parents} = tree[module];

        if (parents.length) {
            await npm.link(module);
        }

        if (tree[module].links === 0) {
            // we have created all links of module's deps
            for (const dep of dependsOn) {
                await npm.linkWith(module, dep);
            }

            core.info(`building ${module}...`)
            await npm.build(module);

            tree[module].links = -1; // prevent other requests to build/link
        }

        for (const parent of parents) {
            tree[parent].links--;
            linkQueue.push(parent);
        }
    }

    for (const module of navigation.list) {
        core.info(`building ${module} module...`)
        await npm.build(module);
    }

    const {sha = 'test'} = github.context;

    core.info('running yfm-docs...');
    await buildDoc(sha);
    
    pr.disableJekyll(sha);

}