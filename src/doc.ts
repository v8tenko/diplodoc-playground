import path from 'node:path';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

import submodule, {doc, nginx} from './navigation';

type Props = {
    input?: string;
    output?: string;
}

export const buildDoc = async (input: string = doc.input): Promise<number> => {
    const pathToBuilder = submodule.path('yfm-docs');
    const excecutable = path.join(pathToBuilder, 'build', 'index.js');

    await io.rmRF(doc.output);
    await io.mkdirP(doc.output);

    return exec.exec(`node ${excecutable}`, ['-i', input, '-o', doc.output]);


}

export const deployDoc = async (sha: string) => {
    const docPath = path.join(doc.output, sha);
    const deployDir = path.join(nginx.folder, sha);
    const deployLink = nginx.host + '/' + sha + '/index.html';

    await io.rmRF(deployDir);
    await io.mkdirP(deployDir);
    
    await io.mv(docPath, nginx.folder);

    return deployLink;
}