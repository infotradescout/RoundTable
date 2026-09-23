#!/usr/bin/env node
import { getRepoByKey, getRepoSnapshot, loadRegistry, parseArgs } from './repo-registry.mjs';

try {
  const args = parseArgs();
  if (Object.keys(args).some(key => !['all', 'repo-key'].includes(key)) ||
      (args.all !== undefined && args.all !== true) || (args.all && args['repo-key'])) {
    throw new Error('Use --all or --repo-key <key>, not both');
  }
  const repos = args.all ? loadRegistry().repos : [getRepoByKey(args['repo-key'])];
  if (repos.length === 0) throw new Error('No repositories to check');
  for (const repo of repos) {
    const snapshot = getRepoSnapshot(repo);
    console.log(`repo: ${repo.key}\npath: ${repo.localPath}\nexists: ${snapshot.exists}\ngit: ${snapshot.isGitRepo}\nbranch: ${snapshot.branch}\nhead: ${snapshot.head}\nstatus: ${snapshot.status}\nremote: ${snapshot.remote}\n`);
    if (snapshot.status !== 'CLEAN') process.exitCode = 2;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
