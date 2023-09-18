import * as github from '@actions/github';

import { Context } from "@actions/github/lib/context";
import { submodules } from '../navigation';

type Octokit = ReturnType<typeof github.getOctokit>

export const createOrUpdateMessage = async (prefix: string, body: string) => {
    const octakit = github.getOctokit(process.env.GH_TOKEN!);

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

export const repository = () => {
  return 'openapi-extension';

  const {repository} = github.context.payload;
  const name = repository!.full_name!.split('/')[1];

  return name;
}

export const isDevRepository = () => {
    const name = repository();

    return submodules.includes(name as any);
}