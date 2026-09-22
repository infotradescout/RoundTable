# Review Packet Standard

Review packets under review-packets/<repo-key>/<lane>/ hold bounded evidence for the selected project's change. A packet is not a reviewer or a release decision.

Record:

- Owning repo, branch, exact candidate and baseline revisions
- Observation time, source of truth, worktree state, and freshness trigger
- Intended outcome and protected behavior
- File disposition, relevant change or targeted excerpts, and actual validation log
- Source, environment, account, provider, and data limitations
- Canonical SI mode, whether independent review was selected, actual reviewer and independence boundary
- Findings, dispositions, corrections, and affected revalidation
- Current user or quorum authority, integration state, and next exact action

Do not label a review passed merely because a packet exists, a named model answered, tests passed, or GitHub reports mergeable. A review of supplied excerpts is narrower than direct source inspection. Keep private inventory and credentials out of public packets; share only data authorized for the reviewer.

The generator may create a scaffold with `not_provided` candidate or baseline fields. An observed local checkout HEAD is neither automatically the PR candidate nor the base. Supply full `--candidate-sha` and `--baseline-sha` values, confirm them against the intended PR and base, and complete the evidence before calling the packet review-ready.

Old Gemini/Gawain fields and exports remain dated historical records, not a current required gate. Use the canonical installed Selective Intelligence skill at ~/.agents/skills/selective-intelligence/SKILL.md and the owning product's release rules. Recheck exact source and authority immediately before merge or deployment.
