# RoundTable Workflow

RoundTable is the dispatcher and ledger for Thomas/Gawain repos. It stores workflow doctrine, registry metadata, lane packets, review packets, parent routing packets, terminal Git state records, and Gemini exports.

It is not a product source mirror. Product repos stay separate and are referenced through `registry/repos.json`.

## Foundation Lane Cap

PR #2 is capped as the RoundTable foundation lane only.

RoundTable owns parent/child routing doctrine, repository boundary records, markdown/frontmatter packet expectations, mechanical safety doctrine, time-freshness laws, and terminal Git state record expectations.

RoundTable owns zero execution runtime. This workflow must not add SQLite schemas, Discord bot/API code, runtime execution, ephemeral workflow transition storage, Drive or Apps Script adapters, Merlin transport, product repo behavior, MealScout storage implementation, or Albion governance math.

## Universal Operating Rule

Every request starts with an existing-state + context check before action.

This applies to code and non-code work, including documents, product strategy, screenshots, image intake, reviews, contracts, business workflows, operations, and governance packets.

Required check:

```text
What already exists?
What is already known?
When was status last checked?
Which source of truth was checked?
Is this current or last-known status?
What must be re-checked before approval, merge, apply, send, or close?
What prior decisions constrain this?
What working capability must be preserved?
What conflicts with the request?
What assumptions remain?
What is the smallest aligned next action?
```

## Forward Execution Doctrine

Mandatory rule:

“If there is only one valid next step, continue. If there is a real choice, stop and escalate.”

AI agents must continue automatically when the next step is:

- obvious
- safe
- singular
- inside the authorized lane
- not a merge/deploy/production mutation
- not a governance approval point
- not a repo/project switch
- not a scope crossing
- supported by known validation/evidence

AI agents must not stop merely because a subtask completed.

AI agents may continue through:

- existing-state inspection
- dirty worktree parking
- stash application when already authorized
- scoped file staging
- validation
- fixing in-scope validation failures
- rerunning validation
- committing scoped work
- producing review packets
- preparing the next pre-authorized lane when explicitly allowed

AI agents must stop at real blockers:

- merge approval
- deploy approval
- production mutation
- Gemini review gate
- owner / Truth Lock / 3-Knight approval
- multiple valid paths where the choice matters
- scope crossing
- project/repo switch
- brand-boundary issue
- missing evidence
- failed validation that cannot be fixed in scope
- unsafe assumption
- dirty worktree that cannot be safely parked
- governance or authority uncertainty

This doctrine does not weaken Gemini gates, Zachary QA/DRY gate, Guinevere review, RoundTable 3/3 approval, Gawain merge posture, owner/Truth Lock authority, brand separation, or evidence law.

## Operating Loop

1. Select a repo or workflow by `--repo-key` when repo work is involved.
2. Confirm the local repo path from `registry/repos.json` when repo work is involved.
3. Complete existing-state + context check.
4. Create a lane packet in `lane-packets/` when a lane is needed.
5. Send Gemini objector packet when implementation or governance risk exists.
6. Run Codex in the target product repo only after the approved prompt exists.
7. Create a review packet in `review-packets/`.
8. Create a Gemini handoff in `exports/gemini/` when implementation review is required.
9. Close only after Codex PASS, Gawain PASS, Gemini PASS when required, required human/Knight signoff when applicable, and a clean target worktree.

## Problem Delivery Loop

RoundTable may receive or prepare KnightActionCards for exception routing:

```text
System/source detects issue
-> Merlin extracts/classifies
-> RoundTable routes to correct Knight
-> Knight ChatGPT presents the Action Card
-> Knight reviews, recommends, blocks, or requests escalation
-> RoundTable records non-authoritative review disposition
-> Merlin/product system may execute only after separately recorded approval evidence under the applicable governance rule
```

KnightActionCards are schema-only records until a later lane implements delivery. They are not live approval infrastructure. They must not claim execution, production mutation, Discord delivery, bot automation, implementation authorization, merge authorization, deployment authorization, doctrine-change authorization, runtime execution authority, or governance state transition authority. Any execution requires separately recorded approval evidence under the applicable governance rule.

See `docs/KNIGHT_ACTION_CARD_CONTRACT.md`.

## Gemini Status Gate

No Gemini status means no merge, no closeout, no "approved," and no "ready."

Required packet fields:

```text
geminiStatus:
geminiPreflightRequired:
geminiExecutionAuditRequired:
geminiPreflightResultRef:
geminiExecutionAuditResultRef:
mergeAuthorization:
```

Merge authorization remains blocked until `geminiStatus: execution_audit_passed`, except for explicitly standard, non-core, non-governance, non-runtime, non-product, non-deployment lanes marked `geminiStatus: not_required`.

## Non-Negotiables

- Do not act from assumption alone when current state can be inspected.
- Do not copy product source into RoundTable.
- Do not place live product repos inside RoundTable.
- Scripts must resolve product paths from `registry/repos.json`.
- No lane may close with modified, deleted, or untracked files.
- No raw/full diffs go to Gemini by default.
- No agent may invent files, commits, validation logs, metrics, production status, review status, or completed work.
- No stale status claim may support approve, merge, deploy, send, apply, close, or mark-complete decisions.
