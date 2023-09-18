import * as core from '@actions/core';
import * as github from '@actions/github';

import git from './git';
import npm from './npm';
import navigation from './navigation';
import {createOrUpdateMessage} from './github';
import {buildDoc, deployDoc} from './doc';

import 'dotenv/config';

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

    const link = await deployDoc(navigation.sampleDoc.output, sha);

    createOrUpdateMessage('Deployed to', `Deployed to ${link}`)
}