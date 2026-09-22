# Queue Policy

RoundTable records cross-project work without replacing each product's repository, release checks, or human authority. Use the canonical installed Selective Intelligence skill for current execution and review. Queue order is an operating preference, not an approval gate.

## Project revisit and owner direction

On a project revisit, read that project's latest checkpoint and relevant queue entries before starting another lane. The owner may reprioritize, continue, split, close, or bypass queued work with a direct instruction. Do not make the owner reauthorize implementation or verification already delegated across their projects.

An owner-direct request proceeds to the owning project and its current SI workflow. Record the outcome, exact source, proof, and next unproven transition. Do not create an issue merely to satisfy a historical queue step.

## Requests from others

Partner, teammate, or other-agent proposals enter a bounded queue record when ownership, scope, authority, or current state needs review. A queued request is evidence of a proposal, not permission to merge or change a product. Preserve its requester, project and brand, source revision if code already exists, requested outcome, affected surface, constraints, proof, and authorized next action.

If the change already exists in a product PR, link the exact PR and commit rather than copying its source into RoundTable. Inspect its current state before recommending adoption. The owner can explicitly direct an immediate bounded lane; the queue must not delay that instruction.

## Review and execution route

Owner direction or selected queue item
→ current SI intent and authority check
→ owning project checkpoint and exact source inspection
→ bounded implementation in its own repository
→ relevant local, integration, and user-flow proof
→ independent review only when selected by canonical SI
→ integration or release under current owner and product authority
→ exact continuation record

For auth, payments, safety, governance, schema, contact gates, deployment, and public claims, apply the stronger review or authority controls selected by the canonical SI skill and the owning product. A named Gemini or Gawain response is optional evidence, not an automatic prerequisite or merge instruction.

## Queue states

Use these states for new issue titles or labels:

- intake — proposal received
- needs-route — owning project or scope unresolved
- ready-for-work — intent, authority, and source path established
- in-progress — implementation or verification underway
- needs-review — relevant SI-selected review or evidence pending
- needs-correction — sustained finding or failed check needs repair
- ready-to-integrate — exact candidate and applicable authority are established
- integrated — merged into intended source line
- blocked — a real external or authority condition prevents progress
- stale — source or status must be refreshed
- closed — intentionally removed from active queue

Older Gemini-specific labels remain historical; translate them to the current state when an issue is next handled instead of treating the label as a live gate.

## Required queue record

Requester:
Requester role:
Product/system and brand:
Owning repository:
Requested outcome:
Why it matters:
Affected surfaces:
Current source/PR/commit, if any:
Status observation time and source:
Working capability to preserve:
Constraints and prohibited actions:
Evidence and validation:
SI mode/review state, when relevant:
Current owner or quorum authority:
Next exact action:
Integration and live state:

## Large or stale work

If the owner chooses to park a larger outcome, use a parent issue for the outcome and small child lanes for executable steps. Do not hand a vague parent issue to an implementation agent as a complete prompt.

Re-evaluate stale or repeatedly bypassed items against current source and owner intent. Close, split, or reaffirm them explicitly; do not let stale queue entries appear to be current priority.

Product repositories remain source of truth for code and release state. RoundTable records routing and evidence; it does not confer approval or copy private product data.
