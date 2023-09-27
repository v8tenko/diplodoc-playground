import path from 'node:path';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

import submodule, {doc} from './navigation';

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