# Minimum Change Parameters

No RoundTable-routed request or repo change should proceed without the minimum parameters needed to reduce AI drift, hallucinations, branch confusion, governance mistakes, and assumption-based execution.

This checklist applies to RoundTable lane packets, review packets, terminal state records, and child-lane dispatch. Target repos keep ownership of their runtime, storage, UI, product behavior, and governance implementation.

## RoundTable Foundation Boundary

PR #2 is capped as a dispatcher/ledger foundation lane.

Allowed here:

- Existing-State Law
- doctrine routing rules
- parent/child lane protocol
- repository boundary matrix
- markdown/frontmatter packet schema expectations
- mechanical safety doctrine
- time-freshness law
- terminal Git state record expectations

Forbidden here:

- SQLite schemas
- Discord bot or API code
- runtime execution
- ephemeral workflow transition storage
- Drive or Apps Script adapters
- Merlin runtime or transport implementation
- product repo behavior
- MealScout storage implementation
- Albion governance math unless explicitly routed through Albion

## Universal Phase 0 Requirement

Before any implementation, review, recommendation, document, contract, business workflow, screenshot/image intake action, product decision, or governance packet, the agent must complete an existing-state + context check.

Required Phase 0 fields:

```text
Project / brand / workflow:
Current known state:
Status timestamp:
Source of truth checked:
Last-known vs current:
Freshness risk:
Re-check required before:
Existing artifacts reviewed:
Existing files / docs / screenshots / packets / decisions inspected:
Working capability to preserve:
Prior approvals / rejections / constraints:
Conflicts found:
Gaps / unknowns / risks:
Assumptions being made:
Smallest aligned next action:
```

No implementation should begin from assumptions when existing context is available.

## Time Passage And Status Freshness Requirement

All status claims expire unless refreshed.

Before saying something is done, ready, merged, deployed, validated, accessible, fixed, current, blocked, complete, or still true, the agent must re-check the relevant source of truth or explicitly label the statement as last-known status.

Required wording:

```text
Current check:
Last checked:
Source of truth:
Status freshness:
Assumptions:
```

A stale status claim must not be used to approve, merge, deploy, send, apply, close, or mark work complete.

## Required Before Codex Execution

```text
Requester:
Project / repo:
Local folder:
Goal:
Why it matters:
Lane name:
Branch name:
Baseline SHA:
Current worktree state:
Stash status:
Status timestamp:
Source of truth checked:
Last-known vs current:
Freshness risk:
Re-check required before:
Existing-state + context check:
Working capability to preserve:
Allowed files:
Banned files:
Do-not-touch areas:
Doctrine constraints:
Protected areas touched:
Validation command:
Canonical SI mode and selected review, if any:
Codex checkpoint requirement:
Review evidence requirement:
Actual reviewer and evidence boundary, if selected:
Current owner or quorum authority:
```

## Worktree State Requirement

Before a lane begins, Codex must report:

```text
git status
git branch --show-current
git stash list
```

Preserve unrelated dirty, untracked, or stashed work. Use an isolated worktree or clone for the lane when the active checkout cannot be safely used.

## Existing-State Deep Dive Requirement

Before changing files, Codex must inspect the current implementation and identify:

- relevant files, routes, components, tests, docs, schemas, configs, and runtime boundaries
- existing behavior that already satisfies the goal
- existing behavior that partially satisfies the goal
- conflicts with the requested doctrine or scope
- fragile areas that should not be touched
- dead, risky, deprecated, or quarantined surfaces
- tests that already protect the area
- missing tests

Codex must not replace working functionality with a new abstraction unless the existing implementation is proven incompatible.

Prefer minimal aligned changes over broad rewrites.

## Branch Requirement

```text
one lane = one branch
```

Do not stack unrelated work.

## Selective Intelligence review selection

Apply the installed canonical Selective Intelligence skill at `~/.agents/skills/selective-intelligence/SKILL.md` before work. It selects Lean execution or a risk-triggered Guided Council and any independent review. Do not substitute a named model or RoundTable template for that skill. Record the actual reviewer, source access, evidence boundary, objections, and dispositions when review is selected.

Any selected review packet should include:

- repo
- baseline SHA
- lane name
- branch name
- goal
- existing-state/context findings
- working capability to preserve
- doctrine constraints
- allowed files
- banned files
- protected areas
- validation plan
- specific review questions

## Review Evidence Requirement

After implementation, collect evidence appropriate to the selected SI review and the owning repository's release checks.

Default evidence:

```text
existing-state/context findings
file disposition
worktree status
validation log
lane scope
working capability preserved
conflicts found
assumptions made
```

Share source or diffs only within the authorized project and reviewer boundary. Do not claim a code review from a summary alone.

## Merge Requirement

Integration occurs only when:

1. The exact PR head and intended base are refreshed, and conflicts and relevant checks are resolved.
2. The canonical SI review selected for the actual risk is completed with material findings disposed.
3. The owner, product, and any required human / Knight approval are current and recorded.
4. The release and live-proof transitions remain separately identified.

## Minimum Return Checkpoint

Every Codex lane must return:

```text
Repo:
Lane chosen:
Branch:
Baseline SHA:
Status timestamp:
Source of truth checked:
Last-known vs current:
Freshness risk:
Re-check required before:
Existing-state deep dive:
Files inspected:
Current behavior found:
Working capability preserved:
Conflicts found:
Gaps / risks / assumptions:
Files changed:
What changed:
Tests run:
Test results:
Commit SHA:
Push status:
PR link if opened:
Final git status:
Risks / follow-up needed:
```

Any checkpoint missing the existing-state deep dive defaults to FAIL or PASS WITH CONDITIONS until corrected.
