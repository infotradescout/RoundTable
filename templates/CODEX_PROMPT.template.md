# Codex Prompt

Repo: {{REPO_NAME}} ({{REPO_KEY}})
Local path: {{REPO_PATH}}
Lane: {{LANE_NAME}}
Baseline SHA: {{BASELINE_SHA}}

## Time Passage + Status Freshness

Status timestamp:
Source of truth checked:
Last-known vs current:
Freshness risk:
Re-check required before:

## Gemini Status Gate

geminiStatus:
geminiPreflightRequired:
geminiExecutionAuditRequired:
geminiPreflightResultRef:
geminiExecutionAuditResultRef:
mergeAuthorization:

## Forward Execution Doctrine

“If there is only one valid next step, continue. If there is a real choice, stop and escalate.”

Do not stop merely because a subtask completed.
Continue automatically only when the next step is obvious, safe, singular, inside the authorized lane, and supported by known validation/evidence.
You may continue through existing-state inspection, safe dirty-work parking, already-authorized stash application, scoped staging, validation, fixing in-scope validation failures, rerunning validation, committing scoped work, producing review packets, and preparing the next pre-authorized lane only when explicitly allowed.
Stop for Gemini review gates, owner / Truth Lock / 3-Knight approval, merge/deploy approval, production mutation, multiple valid path choices that matter, scope crossing, repo/project switches, brand-boundary issues, missing evidence, unsafe assumptions, unfixable in-scope validation failures, dirty work that cannot be safely parked, or governance/authority uncertainty.

Work only inside the target repo. Do not copy product source into RoundTable. Do not close with a dirty worktree.
