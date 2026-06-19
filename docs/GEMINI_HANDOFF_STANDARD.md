# Gemini Handoff Standard

Gemini handoff files live under `exports/gemini/<repo-key>/<lane>/`.

Gemini receives a bounded request with:

- Repo and lane identity
- Branch and baseline SHA
- File disposition
- Validation log
- Worktree status
- Specific PASS/FAIL questions
- The forward-execution stop point that triggered the Gemini handoff
- The single next step expected after Gemini returns PASS, if one is already known

Raw/full diffs are omitted by default. Add them only when Gawain explicitly authorizes a raw evidence packet.

Use the same mandatory rule here: “If there is only one valid next step, continue. If there is a real choice, stop and escalate.”

Gemini review is a mandatory stop point for forward execution whenever the gate applies. Agents must continue automatically up to that gate when the path is obvious, safe, singular, inside the authorized lane, and evidence-backed, but they must not use forward execution to bypass Gemini review, owner / Truth Lock / 3-Knight approval, merge/deploy/production mutation, repo switches, scope crossing, brand-boundary limits, or authority uncertainty.
