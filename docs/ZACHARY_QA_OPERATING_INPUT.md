# Zachary QA Operating Input

Recorded: 2026-06-15

## Standing Rule

RoundTable and Merlin workflows must not keep stacking new feature work while existing product or workflow lanes remain un-QAed, unapproved, unmerged, or unreconciled.

The operating order is:

1. QA the current user experience and workflow.
2. Approve or block the current lane from evidence.
3. Merge only governance-cleared work from a clean worktree.
4. Run mainline validation after merge.
5. Clean up duplicated or oversized code with DRY/SRP discipline.
6. Re-QA after cleanup.
7. Only then introduce new features.

Forward execution supports this order by requiring agents to keep moving through the one obvious safe next step, including QA prep, validation, in-scope fixes, validation reruns, and reconciliation work. It does not authorize skipping Gemini, Zachary QA/DRY discipline, Guinevere review, merge authority, owner / Truth Lock / 3-Knight approval, or any production mutation gate.

## RoundTable Application

Current RoundTable priority order:

```text
P0 - Keep KnightActionCard blocked until its own Gemini verdict.
P1 - Complete canonical Discord merge path only from the clean merge worktree.
P2 - After any merge, run mainline validation before any PASS -> MERGED record.
P3 - Create RoundTable QA Checklist / QA Gate doctrine after current merge state is clean.
P4 - Create DRY/SRP audit lane only after current governance/merge state is clean.
```

## Prohibitions

Until current governance and merge reconciliation is clean:

```text
Do not open new feature lanes.
Do not merge from a dirty worktree.
Do not collapse separate lane statuses.
Do not record PASS -> MERGED without actual merge plus post-merge validation.
Do not start DRY/SRP refactors before QA and current merge reconciliation.
```
