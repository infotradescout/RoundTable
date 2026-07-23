# Review Packet Standard

Review packets live under `review-packets/<repo-key>/<lane>/`.

Each packet must include:

- Repo and lane identity
- Branch and baseline SHA
- Status timestamp
- Source of truth checked
- Last-known vs current
- Freshness risk
- Re-check required before
- Existing-state/context findings
- Working capability preserved
- Conflicts, gaps, risks, and assumptions
- geminiStatus
- geminiPreflightRequired
- geminiExecutionAuditRequired
- geminiPreflightResultRef
- geminiExecutionAuditResultRef
- mergeAuthorization
- File disposition
- Worktree status
- Validation log
- Review notes
- Forward-execution compliance notes describing where work continued automatically and where it correctly stopped

Review packets do not include raw/full git diffs by default.

A review packet missing existing-state/context findings, status freshness, or Gemini status fields is incomplete. It should not be treated as review-ready until that section is supplied, except for harmless low-risk work where the missing context can be corrected before apply, send, or merge.

Reject or flag any merge-ready packet when `geminiStatus` is missing, pending, blocked, or `held_pending_gemini`. Reject or flag "ready," "approved," or "merge authorized" language unless `geminiStatus: execution_audit_passed`, or `geminiStatus: not_required` is explicitly justified for a standard non-core lane.

Use the same forward-execution rule during review: “If there is only one valid next step, continue. If there is a real choice, stop and escalate.” Reviewers should confirm the agent did not pause after harmless micro-steps, and also did not cross merge/deploy/production, Gemini, owner / Truth Lock / 3-Knight, scope, repo, brand, evidence, or authority boundaries.
