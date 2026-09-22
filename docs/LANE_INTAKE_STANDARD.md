# Lane Intake Standard

A lane packet under lane-packets/<repo-key>/<lane>/ can preserve the selected project's current state and task. It does not grant new authority or install Selective Intelligence.

Before implementation or review, record:

- Owning project, brand, repository, branch, full baseline SHA, and actual worktree status
- Status timestamp, source of truth, current versus last-known classification, and recheck trigger
- Owner outcome, existing state and artifacts inspected, working capability to preserve
- Conflicts, assumptions, protected files, allowed scope, and prohibited actions
- Proportionate validation plan and exact next action
- Canonical SI skill source, selected Lean or Guided Council mode, and why
- SI review state and evidence reference when review was selected
- Current user or quorum authority and integration state

Set undecided fields to not_evaluated; do not invent a pass, approval, or merge authorization. Missing existing-state or authority information must be resolved before an action it could change. Current user direction can authorize ordinary implementation and verification without a redundant queue or named-provider review.

Historical geminiStatus fields in older packets remain historical data. They are not required in new lane packets and do not block a current SI lane. Use the installed canonical skill at ~/.agents/skills/selective-intelligence/SKILL.md, not a repository copy.

Create a packet with node scripts/create-lane-packet.mjs --repo-key <key> --lane <lane>.
