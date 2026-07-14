---
title: MCP 与 Agent 集成
summary: Agent 可以发现并调用获准商业能力，但不能取代用户同意、政策或后端授权。
status: Beta
audiences:
  - Agent 构建者
  - 安全审核者
evidenceLabel: Mobazha Agent capability 源码
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/pkg/mcp
reviewed: 2026-07-14
translationOf: build/mcp
pageType: reference
lastTested: 2026-07-04
outcome: 初始化已认证 MCP session，只发现其解析 scope 允许的 tool。
estimatedTime: 10 分钟
journey: build
primaryAction:
  label: 初始化 Transport
  href: /zh/build/mcp#初始化-transport
---

## 当前 Transport

Mobazha Node 在 `/v1/mcp` 通过 Streamable HTTP 提供 MCP，GET 与 POST 共用 endpoint。Discovery、authentication、scopes、tool availability 与 error 都是连接 Node version 的属性，而不是本页文字的属性。

## 当前 Authentication 与 Scope 合约

- 每个 `/v1/mcp` 请求首先通过 Node gateway authentication boundary。
- Streamable HTTP front door 解析 caller identity，并要求 `ai:use` scope。
- 管理员身份取得适用 administrative scope set；API token 必须明确包含 `ai:use`。
- 每个 tool 还要求 domain scope，例如 `listings:read`、`orders:manage`、`wallet:read` 或 `chat:write`。
- 缺少所需 scope 的 tool 必须保持不可用或返回 permission denied；MCP 不绕过底层 HTTP authorization。

- [MCP scope guard](https://github.com/mobazha/mobazha/blob/main/pkg/mcp/scope_guard.go)
- [Tool scope mapping](https://github.com/mobazha/mobazha/blob/main/pkg/mcp/auth.go)

## 初始化 Transport

使用支持 Streamable HTTP 的 MCP SDK，并保留服务端返回的 session 信息。初始请求是已认证 `/v1/mcp` endpoint 上的标准 JSON-RPC。

```bash
curl -i -sS http://127.0.0.1:5102/v1/mcp \
  -H "Authorization: Bearer $MBZ_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"example","version":"0.1.0"}}}'
```

初始化后，完成 SDK 的 initialized notification、列出可用 tool，并只调用当前 identity 与 scope set 返回的 tool。

## 预期结果

Initialization 应返回与请求 protocol version 兼容的 MCP session。Tool discovery 只应展示 `ai:use`、解析身份、domain scopes、runtime capabilities 与连接 Node version 共同允许的 tool。换一个更窄的可丢弃 token 重复 discovery，确认受保护 tool 消失或拒绝访问，而不是依赖 prompt 限制。

## 不可绕过的边界

- 认证适合该操作的人类、service 或 Agent identity。
- 请求最窄 scopes，明确 spend 或 settlement authority。
- 后端或政策要求时必须确认。
- Prompt text 不得覆盖 order state、Quote terms、recipient amounts 或 authorization checks。
- 保留可审计 request、approval 与 result 标识，但不记录 secret。

## Audit 与错误

Standalone server 记录结构化 MCP tool audit event，包含 tool name、result、duration、transport、可用时的 resolved identity 与脱敏 arguments。Bridge error 保留 API error boundary，包括 authentication、permission、conflict、rate-limit 与 server failure。

> **Important:** Audit visibility 便于审核，但不会让广泛 token 变安全。创建范围窄、可撤销的 token，并让 secret 远离 prompt 与日志。

## 失败处理与 Compatibility

- Authentication 与 permission error 要修正 credential 或 scope，而不是重试 prompt。
- Tool conflict 要重新读取底层 order 或 resource state。
- Rate limit 与 transient server failure 使用有限 backoff。
- Unknown tool 或 schema version 要重新 discovery，不盲调缓存定义。
- Tool response 成功不能取代用户确认、付款证据或后端拥有的状态。

- [English canonical page](/build/mcp)
