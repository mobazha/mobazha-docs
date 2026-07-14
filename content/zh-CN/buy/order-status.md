---
title: 追踪付款与订单状态
summary: 在判断订单是否已资助、发货、可退款或完成前，对照钱包证据与后端拥有的订单状态。
status: Beta
audiences:
  - 买家
  - 支持人员
  - Agent
evidenceLabel: Unified 订单里程碑与 Node Order API
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/apps/web/src/components/orders/guestOrderStages.ts
reviewed: 2026-07-14
translationOf: buy/order-status
pageType: task
lastTested: 2026-07-14
outcome: 判断当前订单状态能证明什么，以及下一步采取哪项恢复操作才安全。
estimatedTime: 3 分钟
journey: use
primaryAction:
  label: 核对订单
  href: /zh/buy/order-status#开始前
---

## 开始前

- 保留订单标识符或 Guest Order token，以及付款 transaction ID。
- 使用创建订单时的同一店铺与后端。
- 不要把私钥、恢复短语、已认证追踪 URL 或完整客户资料贴入支持聊天。

## 追踪步骤

1. 对账号购买打开 **Orders**；对 Guest Order 打开已保存的追踪链接。
2. 解释状态前先核对卖家、商品、金额、付款资产与创建时间。
3. 打开订单绑定的 Payment Session，将 session ID、canonical asset、funding target、预期金额、settlement mode 与 expiry 和钱包或服务商记录对照。
4. 分别读取 observed amount、remaining amount、observations、适用时的 confirmations，以及后端 funding 状态。
5. 事件通知状态变化时，通过产品 UI 或 `GET /v1/orders/{orderID}/payment-session` 刷新。
6. 采取下一项可用操作前，保存履约、取消、退款或争议证据。

## 预期结果与验证

订单页应显示由后端拥有、单调推进的业务状态视图。WebSocket 事件或钱包通知只是刷新信号；重要决定应通过已认证 HTTP API 或追踪端点复核当前订单。

| 观察结果 | 安全结论 |
|---|---|
| Payment target ready | 订单已有买家可在过期前使用的地址或服务商会话 |
| Transaction broadcast | 钱包尝试发布交易 |
| Transaction detected | 付款系统观察到候选交易 |
| Required confirmations reached | 已可能满足配置的确认 gate |
| Backend state is funded | 订单后端已接受这笔订单的付款证据 |
| Seller marked shipped | 已记录履约证据，仍需检查证据内容 |

Payment Session capability set，而不是静态按钮列表，决定 refresh、cancel、confirm、refund 或 completion 中哪些操作当前可用。

## 失败时

- **No transaction detected：**核对资产、网络、目的地、金额与 expiry，不要发送第二笔付款。
- **Confirmations stalled：**独立检查付款网络，并保留 transaction ID。
- **Wallet confirmed but order awaiting payment：**私下向运营者提供准确的 order 与 transaction 标识符。
- **不同页面状态冲突：**停止自动化操作并报告一致性缺陷。
- **追踪链接无法打开：**确认它属于当前 deployment 且未被截断。

## 恢复与升级处理

不要通过数据库编辑或直接 settlement call 修复买家订单。使用订单状态提供的操作，再携带脱敏证据[获取帮助](/zh/support)。

- [English canonical page](/buy/order-status)
