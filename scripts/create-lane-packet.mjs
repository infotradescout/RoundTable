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
const outputRoot = args['output-root'] || path.join(ROOT, 'lane-packets', repo.key);
const outputDir = path.join(outputRoot, lane);

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

const intake = renderTemplate(`# Lane Intake

Created: {{CREATED_AT}}
Repo: {{REPO_NAME}} ({{REPO_KEY}})
Local path: {{REPO_PATH}}
Remote: {{REPO_REMOTE}}
Lane: {{LANE_NAME}}
Current branch: {{BRANCH}}
Baseline SHA: {{BASELINE_SHA}}
Worktree status: {{WORKTREE_STATUS}}

## Time Passage + Status Freshness

Status timestamp: {{CREATED_AT}}
Source of truth checked: local Git snapshot attempt at registry path; verify actual root and origin before execution
Last-known vs current: observed status only, not product or permission proof
Freshness risk: re-check required if time passes, another agent acts, user reports new activity, or approval/merge/apply/send/close is requested
Re-check required before: implementation, selected SI review, merge, apply, send, close, or completion claim

## Mandatory Phase 0 — Existing-State + Context Check

Project / brand / workflow: TBD
Existing artifacts reviewed: TBD
Current behavior found: TBD
Working capability to preserve: TBD
Prior approvals / rejections / constraints: TBD
Conflicts found: TBD
Gaps / risks / assumptions: TBD
Smallest aligned next action: TBD

Do not implement, rewrite, rename, delete, apply, send, or merge before this section is completed.

## Selective Intelligence and authority

Canonical skill: ~/.agents/skills/selective-intelligence/SKILL.md (verify installed source)
SI mode and trigger: not_evaluated
Selected review and evidence: not_evaluated
Current user or quorum authority: not_evaluated
Integration state: not_evaluated

This packet does not grant authority or require a named model review. Follow the installed canonical skill and actual user instruction.

## Goal
TBD

## Allowed Files
TBD

## Banned Files
Product repos must remain isolated. Do not copy source into Gawain-Main.

## Validation Plan
TBD
`, values);

const status = renderTemplate(`Repo: {{REPO_KEY}}
Lane: {{LANE_NAME}}
Branch: {{BRANCH}}
Baseline SHA: {{BASELINE_SHA}}
Status timestamp: {{CREATED_AT}}
Source of truth checked: local Git snapshot attempt at registry path
Last-known vs current: observed status only
Freshness risk: re-check required before action decisions
Re-check required before: implementation, selected SI review, merge, apply, send, close, or completion claim
Worktree status:
{{WORKTREE_STATUS}}

Existing-state/context check: REQUIRED BEFORE AUTHORITY-SENSITIVE ACTION
Canonical SI source: ~/.agents/skills/selective-intelligence/SKILL.md
SI mode and review: not_evaluated
Current authority and integration: not_evaluated
`, values);

await writeTextFile(path.join(outputDir, 'LANE_INTAKE.md'), intake);
await writeTextFile(path.join(outputDir, 'STATUS.txt'), status);
await writeTextFile(path.join(outputDir, 'FILE_LIST.txt'), 'No files listed yet.');
await writeTextFile(path.join(outputDir, 'VALIDATION_LOG.txt'), 'No validation run yet.');

console.log(outputDir);
