import path from 'node:path';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

import submodule from "./navigation"
import { sampleDoc } from './navigation';

type Props = {
    input?: string;
    output?: string;
}

export const buildDoc = async ({input = sampleDoc.input, output = sampleDoc.output}: Props): Promise<void> => {
    const pathToBuilder = submodule.path('yfm-docs');
    const excecutable = path.join(pathToBuilder, 'build', 'index.js');

    io.rmRF(output);
    io.mkdirP(output);

    await exec.exec(`node ${excecutable}`, ['-i', input, '-o', output])
}