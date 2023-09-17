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

  console.log(process.output.toString());

  const build = spawnSync('node', [`../yfm-docs/build/index.js`, '-i', 'project', '-o', 'doc'])

  if (build.error) {
    // @todo handle problem with gh pr
    core.setFailed(build.error);
  }

  console.log(build.output.toString())
} catch (error: any) {
  core.setFailed(error.message);
}
