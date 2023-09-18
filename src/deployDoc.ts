import * as io from '@actions/io';

import path from 'node:path';

export const deployDoc = (docPath: string, sha: string) => {
    const deployDir = path.join(docPath, sha);

    io.rmRF(deployDir);
    io.mkdirP(deployDir);
    io.mv(docPath, deployDir);
}