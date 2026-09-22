# Legacy optional Gemini review template

Use only if the installed canonical Selective Intelligence skill at `~/.agents/skills/selective-intelligence/SKILL.md` selects an independent reviewer and Gemini is the actual reviewer. This template is not a standing gate, does not create a retrospective preflight, and does not grant integration authority.

Record the reviewer's actual access and evidence boundary. If the reviewer has no repo, file, PR, branch, commit, or connector access, review only the supplied payload and state that limit.

## Repo

`<repo>`

## Lane

`<lane>`

## Branch / Commit

`<branch>`
`<commit>`

## Baseline

`<baseline>`

## Files Changed

```text
<files>
```

## Validation Reported

```text
<commands and results>
```

## Raw Diff / Payload

```diff
<paste raw diff here>
```

## Review Questions

1. Did Codex stay inside the assigned lane?
2. Did Codex avoid banned files?
3. Did Codex preserve repo doctrine?
4. Did Codex avoid cross-brand contamination?
5. Did Codex avoid fake status/test claims?
6. Are the tests/contracts meaningful?
7. Did Codex alter behavior when a contract-only change was enough?
8. Does this conflict with active lanes?
9. Should this merge now, wait, or be corrected?

## Required Output

- Pass / Fail
- Critical blockers
- Doctrine drift
- Scope creep
- Test weakness
- Merge conflicts / lane conflicts
- Merge recommendation
- Required Codex correction prompt if needed
