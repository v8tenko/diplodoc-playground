import * as core from '@actions/core';
import * as github from '@actions/github';

import {spawnSync} from 'node:child_process';
import fs from 'node:fs';

import 'dotenv/config'

try {
  const {payload: {repository}, sha } = github.context

  //@ts-ignore
  const clone = spawnSync('bash', ['run.bash', repository!.name, repository.clone_url, sha])

  if (clone.error) {
    throw clone.error;
  }

  const path = `/home/v8tenko/v8tenko.tech/${sha}`;

  if (fs.existsSync(path)) {
    fs.rmSync(path)
  }

  fs.mkdirSync(path)
  console.log(clone.output.toString());

  const build = spawnSync('node', [`./yfm-docs/build/index.js`, '-i', 'project', '-o', path])

  if (build.error) {
    // @todo handle problem with gh pr
    core.setFailed(build.error);
  }

  const octakit = github.getOctokit(process.env.GH_TOKEN!);
  
  octakit.rest.issues.createComment({
    ...github.context.issue,
    issue_number: github.context.issue.number,
    body: 'ping'
  })

  console.log(build.output.toString())
} catch (error: any) {
  core.setFailed(error.message);
}
