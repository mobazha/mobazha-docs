---
title: Install a Mobazha Node
summary: Build the release candidate from public source, start it locally, and verify the UI and health boundary before exposing it.
status: Beta
audiences:
  - Operators
  - Developers
sourceLabel: Mobazha Node quick start
sourceUrl: https://github.com/mobazha/mobazha#quick-start
reviewed: 2026-07-04
---

## Supported source-build path

The current public release candidate requires Go 1.26.4, Git, and a supported macOS or Linux development environment. Build with the pure-Go crypto implementation, then start on testnet while evaluating payment flows.

```text
git clone https://github.com/mobazha/mobazha.git
cd mobazha
go build -tags goolm -o mobazha .
./mobazha init --testnet
./mobazha start --testnet --open
```

> **Important:** Review the command before running it. v0.3 is not a stable production release, and signed release artifacts have not yet been published.

## What starts

- The first start initializes the default data directory when needed.
- The embedded Web UI and HTTP API listen on http://127.0.0.1:5102 by default.
- Versioned HTTP routes live under /v1/, WebSocket under /ws, and MCP Streamable HTTP under /v1/mcp.
- Local-only listening is the safe default; do not expose the API to the internet until authentication, TLS, firewall, and update plans are reviewed.

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
