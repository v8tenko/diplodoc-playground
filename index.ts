import * as core from '@actions/core';
import * as github from '@actions/github';

try {
  console.log('running on',JSON.stringify(github.context, null, 2))
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error: any) {
  console.log(error)
  core.setFailed(error.message);
}
