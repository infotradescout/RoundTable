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
Source of truth checked: local git snapshot from registry path
Last-known vs current: current as of status timestamp
Freshness risk: re-check required if time passes, another agent acts, user reports new activity, or approval/merge/apply/send/close is requested
Re-check required before: Codex execution, Gemini review, merge, apply, send, close, or completion claim

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

## Gemini Status Gate

geminiStatus: preflight_pending
geminiPreflightRequired: yes
geminiExecutionAuditRequired: yes
geminiPreflightResultRef: TBD
geminiExecutionAuditResultRef: TBD
mergeAuthorization: blocked

No Gemini status means no merge, no closeout, no "approved," and no "ready."

Use geminiStatus: not_required only for explicitly standard, non-core, non-governance, non-runtime, non-product, non-deployment lanes. Use geminiStatus: held_pending_gemini when Gemini is unavailable.

## Forward Execution Doctrine

“If there is only one valid next step, continue. If there is a real choice, stop and escalate.”

Continue automatically only when the next step is obvious, safe, singular, inside the authorized lane, and supported by known validation/evidence.
Do not stop merely because a subtask completed.
Stop for Gemini review gates, owner / Truth Lock / 3-Knight approval, merge/deploy/production mutation, multiple valid path choices that matter, scope crossing, repo/project switches, brand-boundary issues, missing evidence, unsafe assumptions, unfixable in-scope validation failures, dirty work that cannot be safely parked, or governance/authority uncertainty.

## Goal
TBD

## Allowed Files
TBD

## Banned Files
Product repos must remain isolated. Do not copy source into RoundTable.

## Validation Plan
TBD
`, values);

const status = renderTemplate(`Repo: {{REPO_KEY}}
Lane: {{LANE_NAME}}
Branch: {{BRANCH}}
Baseline SHA: {{BASELINE_SHA}}
Status timestamp: {{CREATED_AT}}
Source of truth checked: local git snapshot from registry path
Last-known vs current: current as of status timestamp
Freshness risk: re-check required before action decisions
Re-check required before: Codex execution, Gemini review, merge, apply, send, close, or completion claim
Worktree status:
{{WORKTREE_STATUS}}

Existing-state/context check: REQUIRED BEFORE ACTION
Gemini status:
geminiStatus: preflight_pending
geminiPreflightRequired: yes
geminiExecutionAuditRequired: yes
geminiPreflightResultRef: TBD
geminiExecutionAuditResultRef: TBD
mergeAuthorization: blocked
Forward execution:
If there is only one valid next step, continue. If there is a real choice, stop and escalate.
`, values);

await writeTextFile(path.join(outputDir, 'LANE_INTAKE.md'), intake);
await writeTextFile(path.join(outputDir, 'STATUS.txt'), status);
await writeTextFile(path.join(outputDir, 'FILE_LIST.txt'), 'No files listed yet.');
await writeTextFile(path.join(outputDir, 'VALIDATION_LOG.txt'), 'No validation run yet.');

console.log(outputDir);
