import * as io from '@actions/io';

import path from 'node:path';

export const deployDoc = async (docPath: string, sha: string) => {
    const deployDir = path.join(docPath, sha);

    await io.rmRF(deployDir);
    await io.mkdirP(deployDir);
    
    console.log(docPath, deployDir);
    return io.mv(docPath, deployDir);
}