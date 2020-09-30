const github = require("@actions/github");
const core = require("@actions/core");

async function run() {
  const token = core.getInput('token');
  const octokit = github.getOctokit(token);
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  var labels = core.getInput('labels');
  var description = core.getInput('description');
  const checkName = core.getInput('check_name');

  const annotations = [{
      path: 'README.md',
      start_line: 1,
      end_line: 1,
      start_column: 1,
      end_column: 1,
      annotation_level: type,
      message: description,
  }];

  const req = Object.assign({}, github.context.repo, { ref: core.getInput('commit_sha') });
  const res = await octokit.checks.listForRef(req);
  const check_run_id = res.data.check_runs.filter(check => check.name === checkName)[0].id;
  const update_req = Object.assign({}, github.context.repo, {
      check_run_id,
      output: {
          title: 'Test annotations title',
          summary: `Test annotations summary`,
          annotations
      }
  });
  await octokit.checks.update(update_req);
}

run()
    .then(
        (response) => { console.log(`Finished running: ${response}`); },
        (error) => {
            console.log(`#ERROR# ${error}`);
            process.exit(1);
        }
    );
