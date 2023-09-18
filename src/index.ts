import * as core from '@actions/core';
import * as github from '@actions/github';

import git from './git';
import npm from './npm';
import navigation, {Module} from './navigation';
import pr from './pr';

import {buildDoc, deployDoc} from './doc';

import 'dotenv/config';

export const run = async () => {
    core.info('syncing submodules...')
    await git.update();

    core.info('building modules...')
    await Promise.all(navigation.list.map(npm.install));

    if (pr.isDevRepository()) {
        const module = pr.repository() as Module;

        git.checkout(module, 'coloring');
        
        await npm.install(module);
        await npm.link(module);
    }

     for (const module of navigation.list) {
        await npm.linkDevModule(module);
        await npm.build(module);
     }

    const {sha} = github.context;

    core.info('running yfm-docs...');
    await buildDoc(sha);

    core.info('deploying to nginx...')
    const link = await deployDoc(sha);

    pr.createOrUpdateMessage('Deployed to', `Deployed to ${link}`)
}