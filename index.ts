import * as core from '@actions/core';
import * as github from '@actions/github';

import {spawn} from 'node:child_process';


try {
  const {payload: {repository}, sha } = github.context

  // @ts-ignore
  const process = spawn('bash', ['run.bash', repository!.name, repository.clone_url, sha])

  process.on('error', (error) => {
    throw error;
  })

} catch (error: any) {
  core.setFailed(error.message);
}
