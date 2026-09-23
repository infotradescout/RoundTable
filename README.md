# Gawain's Main

Gawain's Main is the lightweight operating index, command layer, and RoundTable for Thomas's product repos.

It is not a product repo. It is not a source-code mirror. It is the dispatcher and ledger for repo summaries, lane maps, active work, review rules, routing queues, minimum change parameters, parent routing packets, terminal Git state records, and Selective Intelligence work and review handoffs.

RoundTable owns zero execution runtime. It does not own Discord bot code, SQLite schemas, ephemeral workflow state, Drive or Apps Script adapters, Merlin transport, product repo behavior, or Albion governance math unless a future lane explicitly routes that doctrine work to the proper repo.

Use `registry/repos.json` as the live local repo registry. Scripts operate by `--repo-key` and resolve product paths from that registry.

## Core Operating Model

```text
1 VS Code window = 1 repo
1 Codex session = that repo only
Inside each repo = sequential lanes, one branch at a time
Across repos = parallel work
```

## RoundTable Foundation Boundary

PR #2 is capped as the RoundTable foundation lane only.

Allowed in this lane:

- Existing-State Law
- doctrine routing rules
- parent/child lane protocol
- repository boundary matrix
- markdown/frontmatter packet schema expectations
- mechanical safety doctrine
- time-freshness law
- terminal Git state record expectations

Forbidden in this lane:

- SQLite schemas
- Discord bot or API code
- runtime execution
- ephemeral workflow transition storage
- Drive or Apps Script adapters
- Merlin runtime or transport implementation
- MealScout, TradeScout, Sway, AutoBott, or other product repo behavior
- Albion governance math unless explicitly routed through Albion

## Universal Existing-State Law

All RoundTable-routed requests must begin by understanding the existing state before action is routed, packeted, reviewed, merged, sent, applied, or marked complete.

This is a dispatcher/ledger requirement. It records and routes evidence; it does not implement runtime behavior in this repo.

```text
Read reality first.
Preserve what works.
Act only from evidence.
Label assumptions.
Make the smallest aligned move.
Never fake status.
```

No implementation, recommendation, review, document, workflow, plan, intake action, or apply/send/merge decision may proceed from assumption alone when existing context can be inspected.

See `docs/UNIVERSAL_EXISTING_STATE_REQUIREMENT.md`.

## Round Table Model

Gawain's Main is the real-world Round Table for Albion.

```text
Thomas = human counterpart to Gawain
Levon = human counterpart to Lancelot
Dylan = human counterpart to Percival
```

Human Knights hold absolute authority over AI Knights. AI Personas orchestrate digital workflows and reviews; they do not replace the consent or authority of their Human Counterparts.

See `ROUND_TABLE.md`.

## Authority Model

Thomas and any existing product-specific human quorum retain final authority. The current cross-project execution workflow follows the canonical installed Selective Intelligence skill at `~/.agents/skills/selective-intelligence/SKILL.md`; RoundTable does not copy or replace that skill. Lean work is the default, and the canonical skill selects independent review or Guided Council when the actual risk warrants it. A Gemini or Gawain response is optional evidence, not a standing gate or merge instruction. See `REVIEW_RULES.md`.

## Minimum Change Rule

No repo change proceeds without the minimum parameters needed to reduce drift, hallucinations, branch confusion, and governance mistakes.

See `MINIMUM_CHANGE_PARAMETERS.md`.

## Queue-First Safety Rule

The queue is for non-Thomas requests or changes, partner/team requests, already-made outside changes, unclear requests, and work Thomas chooses to park.

Thomas works the queue. The queue does not block Thomas from giving direct instructions.

```text
Non-Thomas / unclear / partner-submitted
→ queue issue
→ existing-state and current authority check
→ correct project and bounded lane
→ current Selective Intelligence workflow
```

## Source of Truth Rule

Product repos remain the source of truth.

```text
TradeScout code stays in TradeScout
MealScout code stays in MealScout
Sway code stays in Sway
Albion governance stays in Albion
Merlin workflow stays in Merlin
AutoBott code stays in AutoBott
```

This repo stores summaries and operating context only.

## Review Evidence Rule

Review packets record actual source identity, worktree state, file disposition, validation output, existing-state findings, objections, and evidence limits. A reviewer has only the source and tools actually supplied or inspected. Do not treat a model name or a packet as proof of independent review or authority. Keep private project data out of public packets.

## Command Layer

```bash
npm run check:scripts
node scripts/list-repos.mjs
node scripts/check-repo.mjs --repo-key tradescout
node scripts/check-lane-clean.mjs --repo-key tradescout
node scripts/create-lane-packet.mjs --repo-key tradescout --lane example-lane
node scripts/create-review-packet.mjs --repo-key tradescout --lane example-lane
```

## Connector Rule

When GitHub connector state conflicts with local git, local git is source of truth.

Use local git and browser GitHub for branch/PR creation when connector routing is unreliable.
