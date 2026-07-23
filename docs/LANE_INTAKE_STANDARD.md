# Lane Intake Standard

Every lane starts with a lane packet under `lane-packets/<repo-key>/<lane>/`.

Every lane must begin with Mandatory Phase 0 — Existing-State + Context Check before implementation or review.

Forward execution is mandatory after intake when the next step is obvious, safe, singular, inside the authorized lane, and supported by known validation/evidence.

Mandatory rule:

“If there is only one valid next step, continue. If there is a real choice, stop and escalate.”

Required intake fields:

- Repo key and local path
- Current branch
- Baseline SHA
- Worktree status
- Status timestamp
- Source of truth checked
- Last-known vs current
- Freshness risk
- Re-check required before
- Goal
- Existing-state/context findings
- Existing files, docs, packets, decisions, screenshots, or artifacts inspected
- Working capability to preserve
- Conflicts, gaps, risks, and assumptions
- Allowed files
- Banned files
- Validation plan
- geminiStatus
- geminiPreflightRequired
- geminiExecutionAuditRequired
- geminiPreflightResultRef
- geminiExecutionAuditResultRef
- mergeAuthorization
- Forward-execution stop points or approval boundaries that apply to the lane

A lane packet missing the existing-state/context section or Gemini status fields is incomplete and should not be sent to Codex.

Use `geminiStatus: held_pending_gemini` when Gemini is unavailable. Use `geminiStatus: not_required` only for explicitly standard, non-core, non-governance, non-runtime, non-product, non-deployment lanes.

Do not stop just because intake, inspection, parking, staging, validation, or review-packet preparation hit a checkpoint. Stop when the next step is a real choice, Gemini review gate, owner / Truth Lock / 3-Knight approval, merge/deploy/production mutation, scope crossing, repo/project switch, brand-boundary issue, missing evidence, unfixable in-scope validation failure, unsafe assumption, unsafely dirty worktree, or governance/authority uncertainty.

Use `node scripts/create-lane-packet.mjs --repo-key <key> --lane <lane>`.
