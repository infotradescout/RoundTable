import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { githubIdentity, validateRegistry, buildPortfolioRegistry } from './portfolio-registry.mjs';
import { getRepoSnapshot, assertCleanRepo, formatStatus, loadRegistry, runGit } from './repo-registry.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'roundtable-registry-'));
after(() => fs.rmSync(root, { recursive: true, force: true }));
let serial = 0;
const owner = 'example';
const known = () => ({ schemaVersion: 1, sourceOfTruth: 'local', repos: [{ key: 'product', name: 'Product',
  kind: 'product', localPath: '/unverified/checkout', remote: 'https://github.com/example/Product.git',
  defaultBranch: 'main', status: 'discovered', notes: 'Keep this local mapping' }] });
const found = (changes = {}) => ({ id: '100', repository_full_name: 'example/Product', default_branch: 'main',
  visibility: 'public', archived: false, ...changes });
function fixture() {
  const localPath = path.join(root, `repo-${serial++}`);
  fs.mkdirSync(localPath);
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: localPath, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr || result.error?.message);
    return result.stdout.trim();
  };
  git('init', '-b', 'main');
  git('-c', 'user.name=Registry test', '-c', 'user.email=test@example.invalid', 'commit', '--allow-empty', '-m', 'fixture');
  git('remote', 'add', 'origin', 'https://github.com/example/Product.git');
  return { key: 'product', localPath, remote: 'https://github.com/example/Product.git', git };
}
function cli(repos, args) {
  const file = path.join(root, `registry-${serial++}.json`);
  fs.writeFileSync(file, JSON.stringify({ schemaVersion: 1, repos }));
  return spawnSync(process.execPath, [fileURLToPath(new URL('./check-repo.mjs', import.meta.url)), ...args], {
    encoding: 'utf8', env: { ...process.env, ROUNDTABLE_REGISTRY_PATH: file, ROUNDTABLE_DISCOVERY_PATH: '' }
  });
}

for (const remote of ['https://github.com/Example/Product.git', 'https://github.com/example/product/',
  'git@github.com:Example/Product.git', 'ssh://git@github.com/example/product.git']) {
  test(`canonical identity supports ${remote.split(':')[0]} transport`, () => assert.equal(githubIdentity(remote), 'example/product'));
}
for (const remote of ['https://token@github.com/example/product.git', 'https://github.com.evil.invalid/example/product',
  'https://github.com:8443/example/product', 'https://github.com/example/product?secret=x', 'file:///tmp/project',
  'ssh://other@github.com/example/product', '../project', null]) {
  test('invalid, credential-bearing or foreign remote is rejected: ' + String(remote).split('?')[0], () => assert.equal(githubIdentity(remote), null));
}
test('discovery retains an exact known local mapping and original inputs', () => {
  const base = known(), snapshot = { repositories: [found({ default_branch: 'release' })] };
  const before = JSON.stringify([base, snapshot]);
  const result = buildPortfolioRegistry(base, snapshot, owner);
  assert.equal(result.repos[0].key, 'product');
  assert.equal(result.repos[0].localPath, '/unverified/checkout');
  assert.equal(result.repos[0].notes, 'Keep this local mapping');
  assert.equal(result.repos[0].defaultBranch, 'release');
  assert.equal(result.repos[0].localExecutionVerified, false);
  assert.equal(JSON.stringify([base, snapshot]), before);
});
test('all 25 linked repositories are represented without inventing checkout paths or access', () => {
  const repositories = Array.from({ length: 25 }, (_, i) => found({ id: String(i + 1),
    repository_full_name: `example/Repo-${i}`, visibility: i % 2 ? 'private' : 'public' }));
  const result = buildPortfolioRegistry({ repos: [] }, { repositories }, owner);
  assert.equal(result.repos.length, 25);
  assert.equal(result.discoveryScope.linkedRepositories, 25);
  assert(result.repos.every(repo => repo.localPath === '' && repo.status === 'placeholder' && repo.localExecutionVerified === false));
});
test('a private repository is not silently omitted or relabeled public', () => {
  const result = buildPortfolioRegistry({ repos: [] }, { repositories: [found({ visibility: 'private' })] }, owner);
  assert.equal(result.repos[0].visibility, 'private');
});
test('renamed or absent historical mappings are preserved, not matched by display name', () => {
  const result = buildPortfolioRegistry(known(), { repositories: [found({ repository_full_name: 'example/New-Product' })] }, owner);
  assert.equal(result.repos.length, 2); assert.equal(result.discoveryScope.unmatchedHistoricalMappings, 1);
  assert.equal(result.repos[1].localPath, '');
});
test('connector credentials and unrelated metadata are never copied into new records', () => {
  const result = buildPortfolioRegistry({ repos: [] }, { repositories: [found({ token: 'do-not-copy',
    clone_url: 'https://do-not-copy@github.com/example/Product', permissions: { admin: true } })] }, owner);
  const text = JSON.stringify(result);
  assert(!text.includes('do-not-copy')); assert(!text.includes('permissions'));
});
test('archived repositories remain visible without creating execution evidence', () => {
  const result = buildPortfolioRegistry({ repos: [] }, { repositories: [found({ archived: true })] }, owner);
  assert.equal(result.repos[0].archived, true); assert.equal(result.repos[0].localExecutionVerified, false);
});
for (const invalid of [{ repositories: [] }, {}, { repositories: [found(), found()] },
  { repositories: [found(), found({ repository_full_name: 'example/Other' })] },
  { repositories: [found({ repository_full_name: 'another/Product' })] },
  { repositories: [found({ default_branch: '' })] }, { repositories: [found({ visibility: undefined })] },
  { repositories: [found({ id: undefined })] }, { repositories: [found({ archived: undefined })] }]) {
  test('incomplete, duplicated or out-of-scope discovery fails closed', () => assert.throws(() => buildPortfolioRegistry(known(), invalid, owner)));
}
test('a discovered key cannot replace a differently mapped historical key', () => {
  const base = known(); base.repos[0].remote = 'https://github.com/example/Old-Product.git';
  assert.throws(() => buildPortfolioRegistry(base, { repositories: [found()] }, owner));
});
for (const mutate of [base => base.repos.push({ ...base.repos[0] }), base => base.repos[0].key = '../outside',
  base => base.repos[0].localPath = null, base => base.repos.push({ ...base.repos[0], key: 'alias' })]) {
  test('ambiguous or malformed base registry fails closed', () => { const base = known(); mutate(base); assert.throws(() => validateRegistry(base)); });
}
test('explicitly missing discovery file is an error, never a partial fallback', () => {
  const file = path.join(root, 'base.json'); fs.writeFileSync(file, JSON.stringify(known()));
  assert.throws(() => loadRegistry({ registryPath: file, discoveryPath: path.join(root, 'absent.json') }));
});
test('shared loader consumes the supplied local discovery snapshot', () => {
  const file = path.join(root, 'base-load.json'), discovery = path.join(root, 'discovery.json');
  fs.writeFileSync(file, JSON.stringify(known())); fs.writeFileSync(discovery, JSON.stringify({ repositories: [found()] }));
  assert.equal(loadRegistry({ registryPath: file, discoveryPath: discovery, owner }).repos[0].repositoryId, '100');
});
test('corrupt Git index causes an observed status failure, never false clean', () => {
  const repo = fixture(); fs.writeFileSync(path.join(repo.localPath, '.git', 'index'), 'invalid-index');
  assert.notEqual(runGit(repo.localPath, ['status', '--porcelain']).code, 0);
  const snapshot = getRepoSnapshot(repo);
  assert.equal(snapshot.status, 'GIT_CHECK_FAILED'); assert.equal(snapshot.failedCheck, 'porcelain');
  assert.throws(() => assertCleanRepo(repo));
});
test('native clean checkout yields exact full HEAD and verified origin', () => {
  const repo = fixture(), snapshot = assertCleanRepo(repo);
  assert.equal(snapshot.head, repo.git('rev-parse', 'HEAD')); assert.match(snapshot.head, /^[a-f0-9]{40}$/);
  assert.equal(snapshot.branch, 'main'); assert.equal(formatStatus(snapshot), 'clean');
});
test('untracked user work is preserved and blocks clean execution', () => {
  const repo = fixture(), file = path.join(repo.localPath, 'unfinished.txt'); fs.writeFileSync(file, 'preserve me');
  assert.equal(getRepoSnapshot(repo).status, 'DIRTY'); assert.throws(() => assertCleanRepo(repo));
  assert.equal(fs.readFileSync(file, 'utf8'), 'preserve me');
});
test('a nested directory cannot be accepted as another repository root', () => {
  const repo = fixture(); fs.mkdirSync(path.join(repo.localPath, 'nested'));
  const nested = { ...repo, localPath: path.join(repo.localPath, 'nested') };
  assert.equal(getRepoSnapshot(nested).status, 'ROOT_MISMATCH'); assert.throws(() => assertCleanRepo(nested));
});
test('an incorrect origin never authorizes a different project checkout', () => {
  const repo = fixture(); repo.git('remote', 'set-url', 'origin', 'https://github.com/example/Other.git');
  assert.equal(getRepoSnapshot(repo).status, 'REMOTE_MISMATCH'); assert.throws(() => assertCleanRepo(repo));
});
test('missing origin is not replaced by the expected remote as fake proof', () => {
  const repo = fixture(); repo.git('remote', 'remove', 'origin');
  const snapshot = getRepoSnapshot(repo); assert.equal(snapshot.status, 'GIT_CHECK_FAILED'); assert.equal(snapshot.remote, '');
});
test('credentials in an observed origin do not enter snapshot output', () => {
  const repo = fixture(); repo.git('remote', 'set-url', 'origin', 'https://never-print@github.com/example/Product.git');
  const snapshot = getRepoSnapshot(repo); assert.equal(snapshot.status, 'REMOTE_MISMATCH');
  assert(!JSON.stringify(snapshot).includes('never-print'));
});
test('SSH and HTTPS origins identify the same repository', () => {
  const repo = fixture(); repo.git('remote', 'set-url', 'origin', 'git@github.com:example/Product.git');
  assert.equal(assertCleanRepo(repo).status, 'CLEAN');
});
test('a detached clean checkout is explicit and retains its exact revision', () => {
  const repo = fixture(); repo.git('checkout', '--detach');
  assert.equal(assertCleanRepo(repo).branch, 'DETACHED');
});
test('native linked worktrees remain supported without rewriting their git files', () => {
  const repo = fixture(), worktree = path.join(root, `worktree-${serial++}`);
  repo.git('worktree', 'add', '--detach', worktree);
  const before = fs.readFileSync(path.join(worktree, '.git'), 'utf8');
  assert.equal(assertCleanRepo({ ...repo, localPath: worktree }).status, 'CLEAN');
  assert.equal(fs.readFileSync(path.join(worktree, '.git'), 'utf8'), before);
});
test('relative and unknown paths never fall back to the current process directory', () => {
  for (const localPath of ['', '.', 'relative/repo', path.join(root, 'absent')]) {
    const snapshot = getRepoSnapshot({ key: 'unknown', localPath });
    assert.equal(snapshot.status, 'PATH_MISSING'); assert.notEqual(formatStatus(snapshot), 'clean');
  }
});
test('Git process start failure produces a nonzero check result', () => {
  assert.notEqual(runGit(path.join(root, 'missing-cwd'), ['status']).code, 0);
});
test('all-project CLI reports every record even when an earlier checkout is unavailable', () => {
  const repo = fixture();
  const result = cli([{ key: 'absent', localPath: '', remote: '' }, repo], ['--all']);
  assert.equal(result.status, 2); assert.match(result.stdout, /repo: absent/); assert.match(result.stdout, /repo: product/);
  assert.match(result.stdout, /status: PATH_MISSING/); assert.match(result.stdout, /status: CLEAN/);
});
test('single-project CLI remains compatible for a clean checkout', () => {
  const repo = fixture(), result = cli([repo], ['--repo-key', 'product']);
  assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /status: CLEAN/);
});
test('dirty checkout makes the CLI fail rather than merely printing DIRTY with success', () => {
  const repo = fixture(); fs.writeFileSync(path.join(repo.localPath, 'unsaved'), 'keep');
  assert.equal(cli([repo], ['--repo-key', 'product']).status, 2);
});
for (const args of [['--all', '--repo-key', 'product'], ['--all', 'false'], ['--unknown'], []]) {
  test('ambiguous or missing CLI selection fails closed: ' + args.join(' '), () => assert.equal(cli([], args).status, 2));
}
test('empty all-project selection cannot report successful verification', () => assert.equal(cli([], ['--all']).status, 2));

test('malformed full names are rejected before URL normalization', () => {
  for (const name of ['example/Pro\nduct', 'example/ Product', 'example/Product#fragment']) {
    assert.throws(() => buildPortfolioRegistry(known(), { repositories: [found({ repository_full_name: name })] }, owner));
  }
});
test('contradictory dirty data cannot be formatted as clean', () => {
  assert.notEqual(formatStatus({ status: 'CLEAN', porcelain: '?? unfinished.txt' }), 'clean');
});
