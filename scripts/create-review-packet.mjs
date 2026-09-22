#!/usr/bin/env node
import path from 'node:path';
import {
  ROOT,
  formatStatus,
  getRepoByKey,
  getRepoSnapshot,
  nowIso,
  parseArgs,
  requireLane,
  renderTemplate,
  writeTextFile
} from './repo-registry.mjs';

const args = parseArgs();
const repo = getRepoByKey(args['repo-key']);
const lane = requireLane(args);
const snapshot = getRepoSnapshot(repo);
const reviewRoot = args['review-root'] || path.join(ROOT, 'review-packets', repo.key);
const siRoot = args['si-root'] || args['gemini-root'] || path.join(ROOT, 'exports', 'si', repo.key);
const reviewDir = path.join(reviewRoot, lane);
const siDir = path.join(siRoot, lane);

const values = {
  CREATED_AT: nowIso(),
  REPO_KEY: repo.key,
  REPO_NAME: repo.name,
  REPO_PATH: repo.localPath,
  REPO_REMOTE: snapshot.remote || repo.remote || '',
  LANE_NAME: lane,
  BRANCH: snapshot.branch,
  BASELINE_SHA: snapshot.head,
  WORKTREE_STATUS: formatStatus(snapshot)
};

const review = renderTemplate(`# Review Packet

Created: {{CREATED_AT}}
Repo: {{REPO_NAME}} ({{REPO_KEY}})
Local path hint: {{REPO_PATH}}
Remote hint: {{REPO_REMOTE}}
Lane: {{LANE_NAME}}
Observed branch: {{BRANCH}}
Observed baseline SHA: {{BASELINE_SHA}}

## Status freshness

Status timestamp: {{CREATED_AT}}
Source of truth checked: local Git snapshot attempt at registry path; verify actual root and origin
Current or last-known: observed status only, not product or permission proof
Freshness risk: re-check after time passes, another agent acts, or an authority-sensitive action is requested
Recheck required before: selected SI review, merge, apply, send, close, or completion claim

## Existing state and intent

- Project, brand, and owner outcome: TBD
- Existing artifacts reviewed: TBD
- Working capability preserved: TBD
- Conflicts and assumptions: TBD
- Protected scope and next unproven action: TBD

## Selective Intelligence and authority

Canonical skill: ~/.agents/skills/selective-intelligence/SKILL.md (verify installed source)
SI mode and trigger: not_evaluated
Reviewer and independence boundary: not_evaluated
Findings and dispositions: not_evaluated
Current user or quorum authority: not_evaluated
Integration state: not_evaluated

A packet does not select a reviewer, grant approval, or prove a release.

## Worktree status

{{WORKTREE_STATUS}}

## File disposition

- Added: TBD
- Modified: TBD
- Deleted: TBD
- Untracked: TBD

## Validation log

No validation run yet.

## Evidence limits and next action

State what the reviewer actually inspected. Share only data authorized for that reviewer and project.
`, values);

const siRequest = renderTemplate(`# Optional Selective Intelligence Review Request

Created: {{CREATED_AT}}
Repo: {{REPO_NAME}} ({{REPO_KEY}})
Lane: {{LANE_NAME}}
Observed branch: {{BRANCH}}
Observed baseline SHA: {{BASELINE_SHA}}
Observed worktree status: {{WORKTREE_STATUS}}

This request is not sent and no reviewer is assigned. Use it only if the installed canonical SI skill selects independent review. Supply the outcome, exact candidate revision, allowed and protected scope, actual change, validation evidence, risk, and questions. Identify the reviewer's real provider, context, and evidence boundary. Do not copy the SI skill here or treat this file as authority.

Review decision: not_evaluated
Evidence attached: none
`, values);

const status = [
  'Status timestamp: ' + values.CREATED_AT,
  'Source of truth checked: local Git snapshot attempt at registry path',
  'Current or last-known: observed status only',
  'Freshness risk: re-check before action decisions',
  'Recheck required before: selected SI review, merge, apply, send, close, or completion claim',
  'Worktree status: ' + values.WORKTREE_STATUS,
  'Canonical SI source: ~/.agents/skills/selective-intelligence/SKILL.md',
  'SI mode and review: not_evaluated',
  'Current authority and integration: not_evaluated'
].join('\n') + '\n';

await writeTextFile(path.join(reviewDir, 'REVIEW_PACKET.md'), review);
await writeTextFile(path.join(reviewDir, 'FILE_DISPOSITION.txt'), 'Added:\nModified:\nDeleted:\nUntracked:\n');
await writeTextFile(path.join(reviewDir, 'STATUS.txt'), status);
await writeTextFile(path.join(reviewDir, 'EXISTING_STATE_CONTEXT.txt'), 'Project / brand / workflow:\nExisting artifacts reviewed:\nCurrent behavior found:\nWorking capability preserved:\nPrior decisions / constraints:\nConflicts found:\nGaps / risks / assumptions:\nSmallest aligned action chosen:\n');
await writeTextFile(path.join(reviewDir, 'SI_STATUS.txt'), 'canonicalSkill: ~/.agents/skills/selective-intelligence/SKILL.md\nsiMode: not_evaluated\nsiReview: not_evaluated\ncurrentAuthority: not_evaluated\nintegrationState: not_evaluated\n');
await writeTextFile(path.join(reviewDir, 'VALIDATION_LOG.txt'), 'No validation run yet.');
await writeTextFile(path.join(siDir, 'SI_REVIEW_REQUEST.md'), siRequest);

console.log(reviewDir);
console.log(siDir);
