# Codex Handoff Standard

Codex executes inside one target repo and one lane at a time.

Codex handoff must include:

- Target repo key and absolute local path
- Lane name
- Branch and baseline SHA
- Allowed and banned files
- Validation command
- Required return checkpoint

Forward execution is mandatory inside the approved lane when the next step is obvious, safe, singular, and supported by known evidence.

Mandatory rule:

“If there is only one valid next step, continue. If there is a real choice, stop and escalate.”

Codex must not stop merely because a subtask completed. Codex may continue through existing-state inspection, safe dirty-work parking, already-authorized stash application, scoped staging, validation, fixing in-scope validation failures, rerunning validation, committing scoped work, producing review packets, and preparing the next pre-authorized lane only when that follow-on lane was explicitly authorized.

Codex must stop for merge approval, deploy approval, production mutation, Gemini review gates, owner / Truth Lock / 3-Knight approval, multiple valid paths where the choice matters, scope crossing, repo/project switches, brand-boundary issues, missing evidence, failed validation that cannot be fixed in scope, unsafe assumptions, dirty work that cannot be safely parked, and governance or authority uncertainty.

Codex must not close a lane until the target repo worktree is clean.
