import path from 'node:path';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

import submodule, {doc, nginx} from './navigation';

type Props = {
    input?: string;
    output?: string;
}

export const buildDoc = async (sha: string, input: string = doc.input): Promise<number> => {
    const pathToBuilder = submodule.path('yfm-docs');
    const excecutable = path.join(pathToBuilder, 'build', 'index.js');
    const output = path.join(doc.output, sha);

    await io.rmRF(output);
    await io.mkdirP(output);

    return exec.exec(`node ${excecutable}`, ['-i', input, '-o', output]);


}

export const deployDoc = async (sha: string) => {
    const docPath = path.join(doc.output, sha);
    const deployDir = path.join(nginx.folder, sha);
    const deployLink = nginx.host + '/' + sha + '/index.html';

    await io.rmRF(deployDir);
    await io.mkdirP(deployDir);
    
    await io.mv(docPath, deployDir);

    return deployLink;
}