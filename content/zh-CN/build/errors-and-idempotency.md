---
title: 错误、重试与 Idempotency
summary: 在 transport failure、重复投递、conflict、timeout 和结果未知时保持业务正确。
status: Beta
audiences:
  - 开发者
  - Agent 构建者
evidenceLabel: Node API 错误合约与状态机实现
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/api-spec/openapi.json
reviewed: 2026-07-14
translationOf: build/errors-and-idempotency
pageType: reference
lastTested: 2026-07-04
outcome: 判断应停止、修正、核对还是重试，同时不重复执行受保护业务操作。
estimatedTime: 8 分钟
journey: build
primaryAction:
  label: 查看重试决定
  href: /zh/build/errors-and-idempotency#重试决定
---

## 错误类别

| Status | 解释 | 默认响应 |
|---|---|---|
| `400` | 请求不符合声明合约 | 修正请求，不盲目重试 |
| `401` | 认证缺失或无效 | 刷新或替换预定凭据 |
| `403` | 身份缺少 permission 或 scope | 停止并申请范围更窄的授权访问 |
| `404` | Resource、route 或 deployment surface 不存在 | 核对 identity、version、path 与 capability |
| `409` | 当前状态与尝试的转换冲突 | 决定前重载权威状态 |
| `429` | 超过 rate boundary | Back off 并遵循服务端指示 |
| `5xx` | 服务端或依赖失败 | 仅在 operation 可安全核对时重试 |

读取结构化错误响应和合约定义的 stable code，不要把人类消息解析成机器状态。

## 重试决定

```text
request outcome known success -> record result
request outcome known rejection -> correct or stop
request outcome unknown -> reconcile authoritative state
safe idempotent read -> bounded retry with jitter
financial or state transition -> retry only with contract-supported idempotency
```

## Idempotency 与 Reconciliation

- Endpoint 支持时，为 client operation 分配稳定标识。
- 发送资金或订单转换前持久化 request intent。
- Timeout 后，先读取订单、付款、webhook delivery 或 action status，再重新提交。
- 按 delivery 与 event identity 对 webhook 去重。
- 把 WebSocket event 当作刷新信号，而不是命令。
- Retry budget 必须有限；未知结果交由审核。

```javascript
async function reconcileBeforeRetry(orderId) {
  const order = await api.get('/v1/orders/' + orderId);
  if (order.state !== 'AWAITING_ACTION') return order;
  throw new Error('State still requires an explicitly idempotent retry');
}
```

## Authentication 与信息安全

错误日志可以包含 route、status、stable error code、correlation identifier 与脱敏 resource identity，但不得包含 Bearer token、Basic credential、seed、private key、customer payload 或未脱敏 webhook secret。

## Compatibility

针对每个受支持 Node version 重新运行 negative、timeout、duplicate 与 conflict 测试。Happy path 成功并不能证明重试安全。

- [English canonical page](/build/errors-and-idempotency)
