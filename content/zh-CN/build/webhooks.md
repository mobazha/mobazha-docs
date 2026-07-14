---
title: Webhook 集成合约
summary: 在依赖事件投递前，让 consumer 能处理认证、重试、重复、乱序与版本变化。
status: Beta
audiences:
  - 开发者
  - 运营者
evidenceLabel: Mobazha webhook engine 与 OpenAPI 合约
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/pkg/webhook
reviewed: 2026-07-14
translationOf: build/webhooks
pageType: reference
lastTested: 2026-07-04
outcome: 认证、持久接收、去重并安全核对一次 webhook delivery。
estimatedTime: 15 分钟
journey: build
primaryAction:
  label: 实现 Delivery 验证
  href: /zh/build/webhooks#delivery-envelope-与验证
---

## Consumer 检查清单

- 解析或处理 payload 前验证真实性。
- 使用稳定 event identifier 实现 idempotency。
- 只有持久接收后才返回 success。
- 通过权威 API 核对状态，不把 delivery order 当作 state order。
- 从日志与 dead-letter 工具中移除凭据和个人资料。

## 当前管理表面

Node OpenAPI 合约在 `/v1/webhooks` 下包含 webhook registration、update、deletion、test delivery 与 delivery-history operation。候选版本阶段，event name 与 payload schema 仍随版本变化。

- [Webhook source](https://github.com/mobazha/mobazha/tree/main/pkg/webhook) — Signing、event、persistence、retry 与 delivery 合约。
- [OpenAPI JSON](/openapi.json) — 查找当前 `/v1/webhooks` operation 与 schema。

## Delivery Envelope 与验证

当前 event 使用 CloudEvents 1.0 structured JSON envelope。每次 delivery 包含 `X-Webhook-ID`、`X-Webhook-Timestamp` 与 `X-Webhook-Signature` header。Signature 是对 delivery ID、Unix timestamp 与准确 request body 计算的 HMAC-SHA256，并带 `sha256=` 前缀。

- 用 endpoint secret 和未经修改的 raw body 验证 signature。
- 拒绝当前五分钟 replay window 之外的 timestamp。
- 用 CloudEvent ID 与 delivery ID 作为去重证据；不要假定到达顺序就是业务状态顺序。
- 只有持久接收 event 后才返回 2xx。

```javascript
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyMobazhaWebhook({ secret, webhookId, timestamp, signature, rawBody }) {
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const message = webhookId + '.' + timestamp + '.' + rawBody;
  const expected = 'sha256=' + createHmac('sha256', secret).update(message).digest('hex');
  return expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
```

必须使用准确 raw request bytes；验证前 parse 再 serialize JSON 可能改变签名 body。

- [Signing implementation](https://github.com/mobazha/mobazha/blob/main/pkg/webhook/signer.go)
- [CloudEvent envelope](https://github.com/mobazha/mobazha/blob/main/pkg/webhook/events.go)

## 验证练习

注册非生产 endpoint，触发一次 test delivery 并保留 delivery ID。确认有效请求只持久接收一次；完全相同的 delivery 被去重；修改 body 后 signature verification 失败；replay window 之外的 timestamp 被拒绝。然后通过 HTTP API 核对相关 resource，而不是信任 event order。

## Standalone 默认值

当前 standalone 默认最多投递五次，exponential backoff 从 30 秒开始、上限一小时，request timeout 为 10 秒，polling 为 5 秒，已完成 delivery 保留 7 天。Deployment 可以覆盖这些值，consumer 不得把默认值推断为保证的 retry schedule。

> **Important:** 实际 delivery 是 at least once；重复与乱序是预期集成条件，而非异常 bug。

## Authentication、错误与恢复

Webhook 管理 operation 要求受接受的 administrator、hosted 或 scoped API-token identity。Receiver 使用 endpoint secret 与 signature header 认证 delivery。

- 只在持久接收后返回 `2xx`；transient failure 应返回可重试的 non-success。
- 执行业务效果前去重。
- 每个重要 event 后通过 API 核对 order 或 payment state。
- 手工 replay 前检查 delivery history 与 dead-letter state。
- Endpoint secret 暴露后轮换，并拒绝 replay window 之外的 signature。

- [English canonical page](/build/webhooks)
