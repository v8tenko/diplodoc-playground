import * as core from '@actions/core';
import * as github from '@actions/github';

import git from './git';
import npm from './npm';
import navigation from './navigation';
import { buildDoc } from './buildDoc';
import { deployDoc } from './deployDoc';

export const run = async () => {
    core.info('syncing submodules...')
    await git.update();

    core.info('building modules...')
    await Promise.all(navigation.list.map(async (module) => {
        await npm.install(module);

        return npm.build(module);
    }))

    core.info('running yfm-docs...');
    await buildDoc({});

    core.info('deploying to nginx...')
    const {sha} = github.context;

    deployDoc(navigation.sampleDoc.output, sha);
}