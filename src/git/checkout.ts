import * as core from '@actions/core';

import navigation, {Module} from '../navigation';
import {spawnSync} from "node:child_process"

export const checkout = (module: Module, branch: string) => {
    const pathToModule =  navigation.path(module);
    const process = spawnSync(`git`, ['checkout', branch], {cwd: pathToModule});

   if (process.error) {
    core.error(process.error);
    
    throw process.error;
   }

   core.info(process.output.toString());
}