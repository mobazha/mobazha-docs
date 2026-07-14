---
title: WebSocket 事件
summary: 使用已认证 WebSocket 事件及时更新 UI，再通过权威 HTTP API 核对重要状态。
status: Beta
audiences:
  - 开发者
  - 客户端维护者
evidenceLabel: Mobazha WebSocket gateway 与 event registry
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/internal/api/ws.go
reviewed: 2026-07-14
translationOf: build/websocket
pageType: reference
lastTested: 2026-07-04
outcome: 把已认证事件作为刷新信号，并在重连后恢复当前状态。
estimatedTime: 10 分钟
journey: build
primaryAction:
  label: 查看 Client 行为
  href: /zh/build/websocket#client-行为
---

## 当前连接边界

默认 Node WebSocket endpoint 是 `/ws`。路由多个 Node 的 deployment 也可能使用 Node-specific path。Gateway 在连接加入 Node event hub 前完成认证。

> **Important:** 完整、带版本的 AsyncAPI-style event contract 尚未发布。当前 event envelope 只代表候选版本行为，应针对实际部署的准确 Node 与 client version 测试。

## Client 行为

- 使用受支持 client authentication path；存在更安全 protocol 或 header mechanism 时，不把 token 放入 URL。
- 以有限 backoff 重连，并假定连接缺口会丢失 transient event。
- 对 persistent notification 去重，并容忍新增的未知 event type。
- 把 event 作为刷新受保护状态的信号；不得只凭未经验证的 push payload 结算、退款或完成订单。
- 即使 event 宣布 feature 或 action，也保留 route capability 与 authorization 检查。

```javascript
function reconnectDelay(attempt) {
  const capped = Math.min(30_000, 500 * 2 ** attempt);
  return capped / 2 + Math.random() * capped / 2;
}

async function onOrderEvent(orderId) {
  // The event is a refresh signal. Read protected state before acting.
  return api.get('/v1/orders/' + orderId);
}
```

## 预期结果

认证后，client 应只收到解析身份与 deployment 允许的 event。短暂断开后以有限 backoff 重连，并确认 client 先通过 HTTP 刷新当前 resource state，再启用操作。如果集成要求每个 transient event 都恰好一次、按业务状态顺序到达，则尚不完整。

## Authentication 与 Connection Error

使用部署的 client 与 gateway 支持的认证方式。当有更安全的 session、cookie、header 或 subprotocol 边界时，不要在 WebSocket URL 中放入凭据。认证失败不得降级为匿名管理连接。

- 断开后使用带 jitter 的 backoff，并限制重试次数。
- 假定 gap 中会丢 event，重连后核对当前状态。
- 把 malformed 或 unknown event 当作非权威输入。
- Event identity、version 或 resource binding 有歧义时，停止自动资金操作。

## 实现证据

- [WebSocket gateway](https://github.com/mobazha/mobazha/blob/main/internal/api/ws.go)
- [Event registry](https://github.com/mobazha/mobazha/blob/main/pkg/events/registry.go)
- [Shared client](https://github.com/mobazha/mobazha-unified)
- [English canonical page](/build/websocket)
