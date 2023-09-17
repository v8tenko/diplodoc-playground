import * as core from '@actions/core';
import * as github from '@actions/github';

import {spawnSync} from 'node:child_process';
import process from 'node:process';

try {
  const {payload: {repository}, sha } = github.context

  // @ts-ignore
  // const clone = spawnSync('bash', ['run.bash', repository!.name, repository.clone_url, sha])

  // if (clone.error) {
  //   throw clone.error;
  // }

  // console.log(clone.output.toString());

  console.log(spawnSync('ls ./yfm-docs').output.toString())
  const build = spawnSync('node', [`./yfm-docs/build/index.js`, '-i', 'project', '-o', 'doc'])

  if (build.error) {
    // @todo handle problem with gh pr
    core.setFailed(build.error);
  }

  console.log(build.output.toString())
} catch (error: any) {
  core.setFailed(error.message);
}
