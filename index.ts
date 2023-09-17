import * as core from '@actions/core';
import * as github from '@actions/github';

import {spawn, spawnSync} from 'node:child_process';


try {
  const {payload: {repository}, sha } = github.context

  // @ts-ignore
  const process = spawnSync('bash', ['run.bash', repository!.name, repository.clone_url, sha])

  if (process.error) {
    throw process.error;
  }

  console.log(process.stdout.toString());
} catch (error: any) {
  core.setFailed(error.message);
}
