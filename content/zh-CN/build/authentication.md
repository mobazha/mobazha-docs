---
title: 认证、身份与 Scope
summary: 选择连接 deployment 声明的身份与凭据模型，只授予单一集成需要的 scope。
status: Beta
audiences:
  - 开发者
  - 运营者
  - Agent 构建者
evidenceLabel: OpenAPI security schemes 与 Node auth token API
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json
reviewed: 2026-07-14
translationOf: build/authentication
pageType: reference
lastTested: 2026-07-04
outcome: 选择受支持身份，并签发单一集成所需的最窄凭据。
estimatedTime: 10 分钟
journey: build
primaryAction:
  label: 查看带 Scope 的 API Token
  href: /zh/build/authentication#带-scope-的-api-token
---

## Authentication 模型

| 凭据 | 预定边界 | Transport |
|---|---|---|
| Standalone administrator | 本地运营者管理 | 在受信任 TLS 或 loopback 边界使用 HTTP Basic |
| Hosted identity | 托管用户或 service identity | 由托管认证流程签发的 Bearer JWT |
| Scoped standalone token | 对 standalone Node 的自动化 | 带 `mbz_` 前缀和明确 scopes 的 Bearer token |

Operation 的 OpenAPI `security` 声明是可接受凭据类型的权威。在一条路由被接受的 token，不代表拥有所有路由权限。

## 带 Scope 的 API Token

创建和列出本地 API token 需要管理员身份。使用受支持 Admin 表面或 `/v1/auth/tokens`，记录用途与 owner；secret 只通过受支持的创建响应显示，并存入 secret manager。

```bash
BASE_URL=http://127.0.0.1:5102

curl -fsS \
  -u "$MBZ_ADMIN_USER:$MBZ_ADMIN_PASSWORD" \
  "$BASE_URL/v1/auth/tokens" | jq

curl -fsS \
  -H "Authorization: Bearer $MBZ_API_TOKEN" \
  "$BASE_URL/v1/webhooks" | jq
```

## 验证凭据边界

在可丢弃环境调用一条集成所需只读路由和一条 scope 外路由。目标路由应成功，scope 外路由应返回 `403`，不要扩大 token。无效或已撤销 token 应返回 `401`。记录 token owner、purpose、scopes、creation time、rotation plan 与 revocation path，但不记录 secret。

## Authorization 与 Scope 规则

- Read scope 与 create、manage、spend、settlement 或 administrative scope 分开授予。
- MCP transport 边界要求 `ai:use`，每个 tool 还要求相应 domain scope。
- Buyer-anonymous Guest Checkout 请求不得携带卖家或管理员凭据。
- Multi-store 或 hosted deployment 要明确解析当前 role 与 store context。
- 凭据暴露、角色变化、集成下线或出现无法解释的使用后，轮换并撤销 token。

## 错误与安全处理

- `401` 是 authentication failure，`403` 是 authorization failure；不要把两者合并成重试循环。
- 不要把 token 放入 URL query、文档示例、产品合约之外的 browser storage 或支持报告。
- 日志必须移除 authorization header 与 token creation response。
- 广泛 token 暴露时，先撤销，再调查后续使用。

## Compatibility

自动化应固定到已测试 Node version，并在升级时重新读取 OpenAPI security 与 scope requirements。Frontend login cookie、旧 Basic credential 或 internal hosted token 不会自动成为受支持的公开集成凭据。

- [English canonical page](/build/authentication)
