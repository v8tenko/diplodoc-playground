import * as github from '@actions/github';
import * as core from '@actions/core';

import {spawnSync} from 'node:child_process';
import path from 'node:path';

import navigation from '../navigation';

type Octokit = ReturnType<typeof github.getOctokit>

export const createOrUpdateMessage = async (prefix: string, body: string) => {
    const token = core.getInput('token');
    const octakit = github.getOctokit(token);

    octakit.rest.issues.listComments({
        ...github.context.issue,
        issue_number: github.context.issue.number
      }).then((comments) => {
        const exsistsComment = comments.data.find((comment) => comment.body?.startsWith(prefix))
    
        if (!exsistsComment) {
          octakit.rest.issues.createComment({
            ...github.context.issue,
            issue_number: github.context.issue.number,
            body
          })
    
          return;
        }
    
        octakit.rest.issues.updateComment({
          ...github.context.issue,
              issue_number: github.context.issue.number,
          comment_id: exsistsComment.id!,
          body
        })
    
      })
}

export const branch = () => {
  // @ts-ignore @todo inspect
  const name = github.context.payload.pull_request.head.ref

  return name;
}

export const repository = () => {
  const {repository} = github.context.payload;
  const name = repository!.full_name!.split('/')[1];

  return name;
}

export const isDevRepository = () => {
    const name = repository();

    return navigation.list.includes(name as any);
}


export const pagesDeployLink = () => {
  // @ts-ignore
  const [user, repo] = github.context.full_name.split('/');

  return `https://${user}.github.io/${repo}/${github.context.sha}`
}
