import assert from 'node:assert/strict';

/** Compare repository identity, never credentials or a guessed local path. */
export function githubIdentity(remote) {
  if (typeof remote !== 'string') return null;
  const ssh = /^git@github\.com:([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+?)(?:\.git)?$/.exec(remote);
  if (ssh) return ssh[1].toLowerCase();
  try {
    const url = new URL(remote);
    if (url.hostname !== 'github.com' || url.port || url.search || url.hash) return null;
    if (url.protocol === 'https:' && (url.username || url.password)) return null;
    if (url.protocol === 'ssh:' && (url.username !== 'git' || url.password)) return null;
    if (!['https:', 'ssh:'].includes(url.protocol)) return null;
    const match = /^\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+?)(?:\.git)?\/?$/.exec(url.pathname);
    return match ? match[1].toLowerCase() : null;
  } catch { return null; }
}

export function validateRegistry(registry) {
  assert(registry && Array.isArray(registry.repos), 'Registry must contain a repos array');
  const keys = new Set(), identities = new Set();
  for (const repo of registry.repos) {
    assert(repo && typeof repo.key === 'string' && /^[a-z0-9][a-z0-9._-]*$/.test(repo.key), 'Invalid repo key');
    assert(!keys.has(repo.key), `Duplicate repo key: ${repo.key}`);
    keys.add(repo.key);
    assert(typeof repo.localPath === 'string', `Missing localPath for ${repo.key}; use an empty string for unknown`);
    const identity = githubIdentity(repo.remote);
    if (identity) {
      assert(!identities.has(identity), `Ambiguous local mapping: ${repo.key}`);
      identities.add(identity);
    }
  }
  return registry;
}

/** Merge an owner-scoped connector snapshot in memory. Neither input is mutated. */
export function buildPortfolioRegistry(registry, discovery, owner = 'infotradescout') {
  validateRegistry(registry);
  assert(typeof owner === 'string' && /^[A-Za-z0-9][A-Za-z0-9-]*$/.test(owner), 'Invalid owner scope');
  assert(discovery && Array.isArray(discovery.repositories) && discovery.repositories.length > 0,
    'Discovery must contain a nonempty repositories array');
  const repos = registry.repos.map(repo => ({ ...repo, linkedObservation: 'not_in_snapshot' }));
  const keys = new Set(repos.map(repo => repo.key)), seenNames = new Set(), seenIds = new Set();
  const byIdentity = new Map(repos.map(repo => [githubIdentity(repo.remote), repo]));
  for (const found of discovery.repositories) {
    const fullName = found?.repository_full_name;
    assert(typeof fullName === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(fullName), 'Invalid repository full name');
    const identity = githubIdentity(`https://github.com/${fullName}.git`);
    assert(identity && identity.split('/')[0] === owner.toLowerCase(), 'Discovery contains an invalid or out-of-scope repository');
    assert(typeof found.id === 'string' && /^\d+$/.test(found.id), 'Discovery requires stable repository IDs');
    assert(!seenNames.has(identity) && !seenIds.has(found.id), 'Duplicate or contradictory discovery identity');
    seenNames.add(identity); seenIds.add(found.id);
    assert(typeof found.default_branch === 'string' && found.default_branch.trim(), 'Discovery requires an observed default branch');
    assert(['public', 'private', 'internal'].includes(found.visibility), 'Discovery requires explicit visibility');
    assert(typeof found.archived === 'boolean', 'Discovery requires explicit archived state');
    let repo = byIdentity.get(identity);
    if (!repo) {
      const key = fullName.split('/')[1].toLowerCase();
      assert(/^[a-z0-9][a-z0-9._-]*$/.test(key) && !keys.has(key), 'Discovered key collides with an existing local mapping');
      keys.add(key);
      repo = { key, name: fullName.split('/')[1], kind: 'unclassified', localPath: '',
        remote: `https://github.com/${fullName}.git`, status: 'placeholder',
        notes: 'Linked repository only; local checkout and project kind need confirmation.' };
      repos.push(repo);
    }
    Object.assign(repo, { repositoryId: found.id, repositoryFullName: fullName,
      defaultBranch: found.default_branch, visibility: found.visibility, archived: found.archived,
      linkedObservation: 'observed', localExecutionVerified: false });
  }
  return { ...registry, repos, discoveryScope: { owner, linkedRepositories: seenNames.size,
    unmatchedHistoricalMappings: repos.filter(repo => repo.linkedObservation === 'not_in_snapshot').length,
    localExecutionVerified: false } };
}
