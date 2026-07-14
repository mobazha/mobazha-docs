---
title: 响应订单与争议通知
summary: 使用通知进入相关订单或案件，再刷新权威状态，然后决定是否付款、履约、退款或争议。
status: Beta
audiences:
  - 买家
  - 卖家
  - 支持人员
  - Agent
evidenceLabel: Unified 通知路由、分组与状态测试
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/apps/web/src/app/notifications/page.tsx
reviewed: 2026-07-14
translationOf: buy/order-notifications
pageType: task
lastTested: 2026-07-14
outcome: 把通知路由到目标业务记录，验证当前后端状态，并避免依据过期或不完整事件行动。
estimatedTime: 3–5 分钟
journey: use
primaryAction:
  label: 安全检查通知
  href: /zh/buy/order-notifications#开始前
---

## 开始前

- 使用拥有相关记录的账号、Store context 或 Guest Order recovery link。
- 对 Order identifier、Case identifier 或 Guest Order token 保密。
- Read status、Grouping、Sound 和 Notification text 都是展示状态，不会改变 Order、Payment、Fulfillment、Refund、Dispute 或 Market membership state。

> **Warning:** 绝不能仅因为通知要求就付款、发货、退款、Release fund 或披露证据。打开相关记录并在那里验证动作。

## 检查通知

1. 打开通知铃或 `/notifications`。使用可用的 Order、Transaction、System 或其他 Filter 缩小列表。
2. 阅读 Source、Event type、Time、Counterparty label 和 Order 或 Case context。分组通知可能展示最新事件，同时保留多个 Event identity。
3. 打开通知。当前路由把普通 Order event 送到订单详情、Dispute event 送到订单 Dispute tab、卖家 Guest Order event 送到 Admin order view，并在上下文存在时把 Marketplace review event 送到相应市场卖家页。
4. 在目标页核对 Order、Case、Seller、Buyer、Asset、Amount 和当前 State。执行不可逆或资金动作前，从拥有后端刷新状态。
5. 把一个通知或一组通知标记为已读可以更新 Unread count，但不会确认履约、接受决定或批准交易。
6. 在 Order 或 Dispute flow 中保存相关业务证据，不能只留在通知列表或外部聊天。

## 预期结果与验证

| 通知类型 | 预期目标 | 在目标页验证什么 |
|---|---|---|
| Order created、funded、confirmed、shipped、completed、canceled 或 expired | `/orders/{orderID}` 或卖家 Guest Order view | 当前后端 Order 与 Payment Session state |
| Payment received 或付款状态事件 | 相关订单详情 | Asset、Target、Amount、Observation、Confirmation 和 Funded state |
| Dispute opened 或 Case update | 有标识符时进入 `/orders/{orderOrCaseID}?tab=dispute` | Claim、Response、Evidence reference、Deadline、Moderator 和当前 Dispute state |
| Marketplace seller review | 有市场上下文时进入 `/marketplace/{slug}/sell` | 当前 Membership record 与 Decision reason |
| Chat message | Chat interface 或 Drawer | Sender、Room 或 Order context，以及是否另有 Order action |

目标页应保留相关标识符并显示当前记录。重复 Notification identity 不应创建重复本地项目，但通知仍可能缺失或过期；业务记录始终是权威。

## 失败时

- Dispute notification 没有 Order 或 Case identifier 时可能没有安全路由。手动打开相关 Order 或 Cases view，不要猜测标识符。
- Mark as read 或删除通知失败时，不要改变业务动作，稍后只重试展示操作。
- 通知打开错误 Store、Order 或 Market context 时立即停止，使用脱敏 Notification 与目标标识符报告路由缺陷。
- 通知比显示订单状态更新时，通过产品或认证 API 刷新；不要重放底层 Mutation。
- 当前记录已不允许建议动作时，遵循当前 State，不要遵循旧通知文字。

## 继续

- [跟踪付款与订单状态](/zh/buy/order-status)
- [取消、退款或争议](/zh/buy/cancel-refund-dispute)
- [携带脱敏证据获取帮助](/zh/support)
- [English canonical page](/buy/order-notifications)
