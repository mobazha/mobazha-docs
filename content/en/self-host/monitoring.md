---
title: Monitor a self-hosted Node
summary: Detect process, storage, capability, payment, webhook, and recovery degradation before it becomes an order incident.
status: Beta
audiences:
  - Operators
evidenceLabel: Node diagnostics and operational sources
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
---

## Before you start

- Define who receives alerts and who may take corrective action.
- Keep monitoring credentials separate from Node administrator and signing credentials.
- Decide expected availability, backup age, disk headroom, and payment dependency health.

## Monitoring setup steps

1. Schedule `mobazha service status` and `mobazha doctor --json` from a trusted local monitor.
2. Monitor process restarts, disk space, filesystem errors, system time, and backup age.
3. Poll the runtime capability snapshot and alert on unexpected readiness or method changes.
4. Monitor RPC, indexer, webhook, and external provider latency and failures separately from Node health.
5. Track failed authentication, repeated permission errors, webhook dead letters, and order reconciliation failures.
6. Test alert delivery and document the first safe response for every alert class.

```bash
./mobazha service status
./mobazha doctor --json
curl -fsS http://127.0.0.1:5102/v1/runtime-config | jq
```

## Expected result and verification

Monitoring should distinguish unavailable process, degraded dependency, denied capability, and failed business operation. Trigger a controlled non-production failure and confirm the alert identifies the correct boundary without logging secrets or customer payloads.

## If something fails

- If monitoring loses access, do not weaken Node authentication; repair the narrow monitoring credential or local execution path.
- If a capability becomes unhealthy, stop advertising new work while preserving existing-order recovery.
- If disk or backup alerts fire, protect current data before restarting or upgrading.
- If alerts contain secrets or personal data, treat that as an incident and rotate affected credentials.
