import * as core from '@actions/core';

import git from './git';
import npm from './npm';
import navigation, {Module} from './navigation';
import pr from './pr';

import {buildDoc} from './doc';

import 'dotenv/config';

export const run = async () => {
    core.info('syncing submodules...')
    await git.update();

    if (pr.isDevRepository()) {
        const module = pr.repository() as Module;
        const branch = pr.branch();

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

    core.info('running yfm-docs...');
    await buildDoc();

    const link = pr.pagesDeployLink();

    core.info(`Deployed to ${link}`);

    pr.createOrUpdateMessage('Deployed to', `Deployed to ${link}`)
}