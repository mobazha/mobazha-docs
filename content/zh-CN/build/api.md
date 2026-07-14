---
title: HTTP API 与 OpenAPI
summary: 用生成的 Mobazha Node OpenAPI 合约查 operation 与 schema，并在调用可选能力前验证运行时 capability。
status: Beta
audiences:
  - 开发者
evidenceLabel: 生成的 Mobazha Node OpenAPI 合约
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json
reviewed: 2026-07-14
translationOf: build/api
pageType: reference
lastTested: 2026-07-04
outcome: 确认当前 Node 合约与 capability，再针对其 versioned route 构建。
estimatedTime: 7 分钟
journey: build
primaryAction:
  label: 运行 Capability 调用
  href: /zh/build/api#首次-capability-调用
---

## 合约与入口

Mobazha Node 在 `/v1/` 下提供 versioned HTTP route，在 `/ws` 提供 WebSocket。生成的 OpenAPI 文档描述 API Reference 所示审核版本中的 request method、path、schema、response envelope 与声明的 authentication mechanism。

Specification 是候选版本合约，不能证明某个后端已启用所有可选 operation。公开可选 UI 或自动化前，读取 `/v1/runtime-config` 与 capability endpoint。

- [浏览共用 API Reference](/api-reference) — 在只读、面向人的参考中搜索 operation 与 schema。
- [下载 OpenAPI JSON](/openapi.json) — 对 generator、Agent 与 CI 使用同一份审核合约。
- [API source 与 generator](https://github.com/mobazha/mobazha/tree/main/api-spec) — 检查生成 artifact 与其所属仓库。

## 首次 Capability 调用

本地 Node 无需执行已认证业务 operation，即可公开 frontend runtime snapshot。构建可选 UI 或自动化前，用它验证 schema version、deployment composition、readiness、features 与 capabilities。

```text
curl -sS http://127.0.0.1:5102/v1/runtime-config | jq
```

> **Important:** 示例假定默认本地 listener。不要为了让示例工作而禁用认证或公开管理 listener。

## 预期结果

Runtime 调用应返回成功 JSON envelope，描述 Node schema、deployment composition、readiness 与 effective capabilities。记录准备使用的 Node version 与 capability。Capability 缺失或不可用意味着应停止或降级集成，而不是打开只存在于前端的 switch。

默认 standalone store 在把响应缩小到 composition 字段时，当前会返回以下代表性 projection；capability 与 feature 值依连接的 Node 而异，并保持权威。

```bash
curl -fsS http://127.0.0.1:5102/v1/runtime-config |
  jq '.data | {schemaVersion, authMode, deployment, experience, capabilitiesReady}'
```

```json
{
  "schemaVersion": 3,
  "authMode": "standalone",
  "deployment": {
    "mode": "standalone",
    "allowExternalResources": true
  },
  "experience": {
    "kind": "store"
  },
  "capabilitiesReady": true
}
```

## Authentication 选择

- Standalone 管理员边界可使用 HTTP Basic authentication。
- Deployment 支持时，Bearer JWT 代表 hosted identity。
- 对受支持 standalone integration，带 scope 的 `mbz_` API token 是首选自动化凭据。
- 选择最窄 credential 与 scope set，保存在源码外，暴露后及时轮换或撤销。

## Client 要求

- 使用连接 deployment 要求的 authentication mechanism；凭据不进入 URL 或日志。
- 把 non-success response 与 stable error code 当作状态机一部分，而不只是 transport failure。
- 对可能重试或有资金影响的 operation 使用 idempotency 与 reconciliation。
- Integration 固定到已测试 Node version，升级前重跑 contract tests。
- OpenAPI 或源码中出现 endpoint 但 effective capability 缺失时，不得推断支持。

## Request 与 Response 工作流

```bash
BASE_URL=http://127.0.0.1:5102
curl -fsS "$BASE_URL/v1/runtime-config" | jq
curl -fsS -H "Authorization: Bearer $MBZ_API_TOKEN" "$BASE_URL/v1/webhooks" | jq
```

消费 success envelope 前检查 HTTP status。精确内部 response schema 属于生成的 OpenAPI 合约。Client 配置中明确 base URL、Node version、credential type 与 expected capability。

## 错误、重试与 Compatibility

- 分别处理 `401`、`403`、`404`、`409`、`429` 与 `5xx`。
- 订单、付款、退款或 settlement operation timeout 后核对权威状态。
- Endpoint contract 未提供 idempotency 或 reconciliation 时，不重试资金 mutation。
- 升级前，让生成 client 与手写 integration 对准确 release tag 运行测试。

- [认证与 Scope](/zh/build/authentication)
- [错误、重试与 Idempotency](/zh/build/errors-and-idempotency)
- [English canonical page](/build/api)
