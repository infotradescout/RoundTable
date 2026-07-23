# Gemini Request

Repo: {{REPO_NAME}} ({{REPO_KEY}})
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

## Forward Execution Gate

“If there is only one valid next step, continue. If there is a real choice, stop and escalate.”

Confirm whether execution continued through obvious, safe, singular in-lane steps and stopped at the correct blocker or approval boundary.

Return PASS or FAIL with objections.

Raw/full diff output is omitted by default.
