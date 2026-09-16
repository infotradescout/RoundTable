import { existsSync, readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildPortfolioRegistry, githubIdentity, validateRegistry } from './portfolio-registry.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT = path.resolve(__dirname, '..');
export const REGISTRY_PATH = path.join(ROOT, 'registry', 'repos.json');

export const DISCOVERY_PATH = path.join(ROOT, '.local', 'repositories.json');

export function loadRegistry(options = {}) {
  const registryPath = options.registryPath ?? process.env.ROUNDTABLE_REGISTRY_PATH ?? REGISTRY_PATH;
  const discoveryPath = options.discoveryPath ?? process.env.ROUNDTABLE_DISCOVERY_PATH ?? DISCOVERY_PATH;
  const registry = validateRegistry(JSON.parse(readFileSync(registryPath, 'utf8')));
  const explicitlyRequested = options.discoveryPath !== undefined || Boolean(process.env.ROUNDTABLE_DISCOVERY_PATH);
  if (!existsSync(discoveryPath)) {
    if (explicitlyRequested) throw new Error('Requested discovery snapshot is unavailable');
    return registry;
  }
  return buildPortfolioRegistry(registry, JSON.parse(readFileSync(discoveryPath, 'utf8')), options.owner ?? 'infotradescout');
}

export function getRepoByKey(repoKey) {
  if (!repoKey) {
    throw new Error('Missing required --repo-key');
  }
  const registry = loadRegistry();
  const repo = registry.repos.find((entry) => entry.key === repoKey);
  if (!repo) {
    throw new Error(`Unknown repo key: ${repoKey}`);
  }
  return repo;
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith('--')) {
      throw new Error(`Unexpected argument: ${item}`);
    }
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

export function runGit(repoPath, args, options = {}) {
  const result = spawnSync('git', args, {
    timeout: 15_000,
    maxBuffer: 1024 * 1024,
    ...options,
    cwd: repoPath,
    encoding: 'utf8',
    shell: false,
    env: { ...process.env, ...options.env, GIT_OPTIONAL_LOCKS: '0' }
  });
  return {
    code: result.error || result.signal ? 1 : result.status ?? 1,
    stdout: (result.stdout ?? '').trimEnd(),
    stderr: (result.stderr ?? '').trimEnd()
  };
}

export function repoExists(repo) {
  return Boolean(repo.localPath && path.isAbsolute(repo.localPath) && existsSync(repo.localPath));
}

export function isGitRepo(repo) {
  if (!repoExists(repo)) return false;
  const result = runGit(repo.localPath, ['rev-parse', '--is-inside-work-tree']);
  return result.code === 0 && result.stdout === 'true';
}

export function getRepoSnapshot(repo) {
  const snapshot = { exists: repoExists(repo), isGitRepo: false, branch: 'UNKNOWN', head: 'UNKNOWN',
    status: 'PATH_MISSING', porcelain: '', remote: '' };
  if (!snapshot.exists) return snapshot;
  const inside = runGit(repo.localPath, ['rev-parse', '--is-inside-work-tree']);
  if (inside.code !== 0 || inside.stdout !== 'true') return { ...snapshot, status: 'NOT_GIT_REPO' };
  snapshot.isGitRepo = true;
  const root = runGit(repo.localPath, ['rev-parse', '--show-toplevel']);
  if (root.code !== 0 || !root.stdout) return { ...snapshot, status: 'GIT_CHECK_FAILED', failedCheck: 'root' };
  try {
    if (realpathSync(root.stdout) !== realpathSync(repo.localPath)) return { ...snapshot, status: 'ROOT_MISMATCH' };
  } catch { return { ...snapshot, status: 'GIT_CHECK_FAILED', failedCheck: 'root' }; }
  const checks = [
    ['branch', ['branch', '--show-current']],
    ['head', ['rev-parse', '--verify', 'HEAD']],
    ['porcelain', ['status', '--porcelain']],
    ['remote', ['remote', 'get-url', 'origin']]
  ];
  let rawRemote = '';
  for (const [field, args] of checks) {
    const result = runGit(repo.localPath, args);
    if (result.code !== 0) return { ...snapshot, status: 'GIT_CHECK_FAILED', failedCheck: field };
    if (field === 'remote') rawRemote = result.stdout;
    else snapshot[field] = result.stdout;
  }
  snapshot.branch ||= 'DETACHED';
  if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(snapshot.head)) return { ...snapshot, status: 'GIT_CHECK_FAILED', failedCheck: 'head' };
  const expected = githubIdentity(repo.remote), actual = githubIdentity(rawRemote);
  if (!expected || !actual || expected !== actual) {
    return { ...snapshot, remote: actual ? `https://github.com/${actual}.git` : '', status: 'REMOTE_MISMATCH' };
  }
  snapshot.remote = `https://github.com/${actual}.git`;
  snapshot.status = snapshot.porcelain ? 'DIRTY' : 'CLEAN';
  return snapshot;
}

export function assertCleanRepo(repo) {
  const snapshot = getRepoSnapshot(repo);
  if (snapshot.status !== 'CLEAN') {
    throw new Error(`${repo.key} cannot be confirmed clean: ${snapshot.status}` +
      (snapshot.porcelain ? `\n${snapshot.porcelain}` : ''));
  }
  return snapshot;
}

export function slugify(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function requireLane(args) {
  const lane = args.lane || args['lane-name'];
  const slug = slugify(lane);
  if (!slug) {
    throw new Error('Missing required --lane');
  }
  return slug;
}

export function renderTemplate(template, values) {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    return values[key] ?? match;
  });
}

export async function writeTextFile(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

export function formatStatus(snapshot) {
  if (snapshot.status === 'CLEAN' && !snapshot.porcelain) return 'clean';
  return snapshot.porcelain || String(snapshot.status || 'UNKNOWN').toLowerCase();
}

export function nowIso() {
  return new Date().toISOString();
}
