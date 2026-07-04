---
title: Install a Mobazha Node
summary: Build the release candidate from public source, start it locally, and verify the UI and health boundary before exposing it.
status: Beta
audiences:
  - Operators
  - Developers
evidenceLabel: Mobazha Node quick start
evidenceUrl: https://github.com/mobazha/mobazha#quick-start
reviewed: 2026-07-04
pageType: task
lastTested: 2026-07-04
outcome: Start a local testnet Node from a recorded source revision and verify its health boundary.
estimatedTime: 15–30 minutes
journey: operate
primaryAction:
  label: Review prerequisites
  href: /self-host/install#before-you-start
---

## Before you start

The current public release candidate requires Go 1.26.4, Git, and a supported macOS or Linux environment. Start on testnet and use a dedicated data directory. Confirm available disk space, local firewall policy, backup location, and who controls the administrator session.

- [Review detailed requirements](/self-host/requirements)
- [Read the release scope](/project/release-scope)

## Install steps

1. Clone the public Node repository and record the exact commit you intend to evaluate.
2. Build with the pure-Go crypto implementation shown below.
3. Initialize a testnet data directory owned by the service account.
4. Start the Node on the default local-only listener and open the embedded UI.
5. Keep the terminal visible until initial startup and health checks succeed.

```text
git clone https://github.com/mobazha/mobazha.git
cd mobazha
go build -tags goolm -o mobazha .
./mobazha init --testnet
./mobazha start --testnet --open
```

> **Important:** Review the command before running it. v0.3 is not a stable production release, and signed release artifacts have not yet been published.

## Expected result and verification

- The first start initializes the default data directory when needed.
- The embedded Web UI and HTTP API listen on http://127.0.0.1:5102 by default.
- Versioned HTTP routes live under /v1/, WebSocket under /ws, and MCP Streamable HTTP under /v1/mcp.
- Local-only listening is the safe default; do not expose the API to the internet until authentication, TLS, firewall, and update plans are reviewed.

Run diagnostics in a second terminal:

```bash
./mobazha doctor --json
curl -fsS http://127.0.0.1:5102/v1/runtime-config | jq
```

Verify that diagnostics complete, the embedded UI opens, the runtime snapshot has a supported schema, and optional capabilities remain unavailable until configured and healthy.

## Optional background service

After validating an interactive start, install and inspect the supported background service.

```text
./mobazha service install
./mobazha service status
./mobazha doctor --json
```

## Pre-release packaging

Docker, standalone, and appliance packaging exists in the public repository, but it remains pre-release. Inspect the image tag, downloaded scripts, configuration, update behavior, and recovery path before using it outside a disposable environment.

- [Standalone packaging source](https://github.com/mobazha/mobazha/tree/main/deploy/standalone)
- [Node source and release status](https://github.com/mobazha/mobazha)

## If something fails

- If the build fails, confirm `go version`, the checked-out commit, platform toolchain, and available storage.
- If startup fails, capture sanitized diagnostics and confirm data-directory ownership and port availability.
- If the UI does not open, test the local listener before changing DNS, TLS, or firewall configuration.
- If runtime capabilities are not ready, inspect configuration and dependencies rather than enabling frontend controls manually.
- Remove only a disposable test data directory you deliberately created; never delete the only copy of a store to retry installation.
