import * as core from '@actions/core';
import * as github from '@actions/github';

try {
  const {payload: {repository}, sha } = github.context

} catch (error: any) {
  console.log(error)
  core.setFailed(error.message);
}
