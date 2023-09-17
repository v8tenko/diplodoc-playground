import core from '@actions/core';
import github from '@actions/github';

try {
  console.log('running on', github.context.ref, github.context.payload)
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error: any) {
  core.setFailed(error.message);
}
