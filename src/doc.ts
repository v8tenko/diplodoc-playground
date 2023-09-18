import path from 'node:path';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

import submodule, {sampleDoc, nginx} from './navigation';

type Props = {
    input?: string;
    output?: string;
}

export const buildDoc = async ({input = sampleDoc.input, output = sampleDoc.output}: Props): Promise<number> => {
    const pathToBuilder = submodule.path('yfm-docs');
    const excecutable = path.join(pathToBuilder, 'build', 'index.js');

    await io.rmRF(output);
    await io.mkdirP(output);

    return exec.exec(`node ${excecutable}`, ['-i', input, '-o', output]);
}

export const deployDoc = async (docPath: string, sha: string) => {
    const deployDir = path.join(nginx.folder, sha);
    const deployLink = nginx.host + '/' + sha + '/index.html';

    await io.rmRF(deployDir);
    await io.mkdirP(deployDir);
    
    await io.mv(`${docPath}/*`, deployDir);

    return deployLink;
}