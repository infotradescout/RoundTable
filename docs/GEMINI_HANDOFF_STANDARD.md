# Legacy optional Gemini handoff

Historical Gemini handoff files may live under `exports/gemini/<repo-key>/<lane>/`. New packets use `exports/si/<repo-key>/<lane>/` and select a reviewer only when the installed canonical Selective Intelligence skill calls for one. A Gemini request is neither a standing gate nor merge authority.

If Gemini is explicitly selected, send a bounded request with:

- Repo and lane identity
- Branch and baseline SHA
- File disposition
- Validation log
- Worktree status
- Specific questions and the actual evidence boundary

Include only evidence authorized for that reviewer and project. A response describes its own observed scope, not a retroactive preflight or human approval.
