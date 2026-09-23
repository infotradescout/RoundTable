# All Repos Operation

The shared loader is no longer limited to seven hardcoded project names. It reads `registry/repos.json` and, when present, the owner-scoped connector snapshot in ignored `.local/repositories.json`. `ROUNDTABLE_REGISTRY_PATH` and `ROUNDTABLE_DISCOVERY_PATH` may explicitly select external local files. An explicitly requested missing snapshot is an error, not a silent partial fallback.

Every discovered project is represented, including private repositories. Existing keys and paths are reused only on exact normalized GitHub identity. An unknown checkout remains an empty path/placeholder; an absent or renamed historical mapping is retained separately instead of silently reassigned or deleted. Duplicate IDs, ambiguous keys, incomplete metadata and out-of-owner records fail validation. An unknown project kind is `unclassified`, not an invented product classification. The snapshot is observed metadata, not current local execution proof.

The snapshot shape is `{ "repositories": [...] }`. Each entry needs `id` (numeric string), `repository_full_name`, `default_branch`, `visibility` and `archived`. Strip credentials and unrelated response metadata before saving it. Do not commit the snapshot, private inventory, private project packets or local execution logs to this public repository.

## Shared commands

```bash
node scripts/list-repos.mjs
node scripts/check-repo.mjs --all
node scripts/check-repo.mjs --repo-key tradescout
node scripts/check-lane-clean.mjs --repo-key tradescout
node scripts/create-lane-packet.mjs --repo-key tradescout --lane example-lane
node scripts/create-codex-prompt.mjs --repo-key tradescout --lane example-lane
node scripts/create-review-packet.mjs --repo-key tradescout --lane example-lane
npm run check:repo-registry
```

`--all` checks every loaded record even after a prior record fails. It only reads local Git state. It does not clone, install dependencies, change branches, edit a product, create accounts, run application tests or deploy. Any dirty, missing, wrong-root, wrong-origin or failed-Git result makes the command exit nonzero. A valid clean checkout includes its full commit identity. A clean detached worktree remains explicitly `DETACHED`.

## Implementation continuation

The owner has already delegated project implementation and verification using available authorized tools. After preflight, continue the relevant existing checkpoint in each independent lane using SI/Infinity where actually installed. Inspect only the next dependency, preserve unrelated work, and use targeted verification while editing. Native application/browser proof and the project’s unchanged release gate belong on the final integration candidate.

A registry entry is not a runtime installation. A clean worktree is not a passing application. A planned test is not an executed test. Record each boundary separately. Do not hold every independent project at a failed shared connection when other authorized source work can proceed, and do not claim background execution after a response ends.
