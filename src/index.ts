import * as core from '@actions/core';

import npm from './npm';
import submodule from './submodule';

export const run = async () => {
    core.info('syncing submodules...')
    await submodule.update();
    core.info('building modules...')
    await Promise.all(submodule.list.map(async (module) => {
        await npm.install(module);

        return npm.build(module);
    }))
}