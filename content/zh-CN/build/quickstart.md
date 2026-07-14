---
title: 五分钟调用本地 Mobazha Node API
summary: 发现运行时能力，使用声明的认证边界，并向本地评估 Node 发出一条只读请求。
status: Beta
audiences:
  - 开发者
  - Agent 构建者
evidenceLabel: 生成的 Node OpenAPI 与运行时合约
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json
reviewed: 2026-07-14
translationOf: build/quickstart
pageType: task
lastTested: 2026-07-04
outcome: 确认连接到哪个 Node，并完成一条带 scope 的只读 API 请求。
estimatedTime: 5 分钟
journey: build
primaryAction:
  label: 运行首次调用
  href: /zh/build/quickstart#首次调用
---

## 首次调用

本地评估 Node 运行后，把带 scope 的 `MBZ_API_TOKEN` 放入环境变量；先发现运行时，再调用受保护的只读 endpoint。

Token 不是公开注册 key。Standalone 管理员通过受支持的 Admin 表面或 token API 创建它，只赋予集成所需 scope，并把一次性 secret 保存在源码外。运行受保护调用前先阅读[Token 创建与撤销](/zh/build/authentication)。

```bash
BASE_URL=http://127.0.0.1:5102

curl -fsS "$BASE_URL/v1/runtime-config" | jq

curl -fsS \
  -H "Authorization: Bearer $MBZ_API_TOKEN" \
  "$BASE_URL/v1/webhooks" | jq
```

## 开始前

- 在默认 loopback listener 上运行 v0.3 候选版本 Node。
- 安装 `curl` 与 `jq`；凭据放入环境变量，不留在 shell history。
- 使用可丢弃测试 profile，以及 operation 所需的最窄身份。
- 阅读当前 OpenAPI security 声明；公开 runtime discovery 不会让管理路由变成公开路由。

## 首次调用步骤

1. 读取公开 runtime snapshot，记录 schema、deployment、readiness 与展示的 capabilities。
2. 确认 Node version 和 operation 存在于生成的 OpenAPI 合约。
3. 按 operation 声明选择 standalone Basic Auth、hosted Bearer JWT 或带 scope 的 `mbz_` API token。
4. 先调用只读 endpoint，同时检查 HTTP status 与 response envelope。
5. 从终端输出、日志、截图和支持证据中移除凭据。

## 预期结果与验证

Runtime discovery 应无需管理凭据即可返回成功 envelope。只有 token 有效且具备所需 scope 时，受保护调用才成功。构建自动化前确认响应属于目标 Node。

还应在可丢弃环境测试一条 token scope 之外的路由，它应返回 `403`；如果成功，说明凭据比 quickstart 所需更宽，应在部署自动化前替换。

## 失败时

- `401` 表示认证缺失或无效；不要用猜测凭据快速重试。
- `403` 表示解析出的身份缺少所需 permission 或 scope。
- `404` 可能表示 base URL、version、route 错误或 composition 不可用；检查 OpenAPI 与 runtime capabilities。
- `409` 通常要求先核对状态再重试。
- `429` 要求有限 backoff 并遵循服务端指示。
- Transport 成功但 application error 仍需错误处理。

## 继续

- [认证、身份与 Scope](/zh/build/authentication)
- [错误、重试与 Idempotency](/zh/build/errors-and-idempotency)
- [HTTP API 与 OpenAPI](/zh/build/api)
- [English canonical page](/build/quickstart)
