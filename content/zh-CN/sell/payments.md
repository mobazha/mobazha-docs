---
title: 准备店铺收款方式
summary: 只展示由后端允许、正确配置、健康且运营者能够监控和恢复的支付路径。
status: Beta
audiences:
  - 卖家
  - 运营者
evidenceLabel: Node PaymentSession 与 Unified 支付管理
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/payments
reviewed: 2026-07-06
translationOf: sell/payments
pageType: task
lastTested: 2026-07-04
outcome: 只有在配置、资金目标、观察、验证和恢复路径均已证明后，才启用一种支付方式。
estimatedTime: 20–40 分钟
journey: use
primaryAction:
  label: 开始支付就绪检查
  href: /zh/sell/payments#开始前
---

## 开始前

- 候选版本评估应使用测试网、小额和可丢弃订单。
- 确认发行版本允许该方式，后端实现它，店铺也完成配置。
- 理解密钥托管、观察、确认、退款、费用和外部依赖。
- 不要把助记词或私钥输入文档、聊天或无关服务商表单。

## 把支付理解为订单绑定的 Payment Session

订单详情通过 `/v1/orders/{orderID}/payment-session` 读取 Payment Session。Admin 开关或支付 Logo 不能代替以下事实：

| 字段 | 回答的问题 |
|---|---|
| `paymentCoin` | 当前要求哪个 canonical 加密资产或法币服务商与币种？ |
| `settlementMode` | 使用地址监控、服务商 Checkout、Escrow 还是其他支持路径？ |
| `productMode` | 订单是 direct、cancelable 还是 moderated？ |
| `fundingTarget` | 当前地址或 Provider Session、资产、金额、Memo 与二维码是什么？ |
| `paymentProgress` | 已观察多少、还差多少、当前 Funding State 是什么？ |
| `expiresAt` | 何时必须刷新，而不能继续复用原资金目标？ |
| `capabilities` | 当前允许刷新、取消、确认、退款或完成中的哪些动作？ |
| `userActionRequest` | 哪个钱包或服务商动作仍需用户明确执行？ |

不要把支付就绪、资金观察、验证和最终结算压成一个状态。

## 支付就绪步骤

1. 打开 **Admin → Payments**（`/admin/payments`），查看收款账户、Provider、Guest Checkout 政策和后端就绪状态。
2. 选择一种方式，只完成其明确要求的设置。
3. 验证配置和健康状态，不依赖前端开关做推断。
4. 检查确认策略、过期策略、退款地址或 Provider 恢复路径。
5. 创建小额测试订单，对照 Session ID、Order ID、canonical 资产、Settlement Mode、Funding Target、金额和有效期。
6. 广播或授权测试付款，区分“已观察”与“后端已接受为 funded”。
7. 重新打开订单，确认 Capabilities 只展示当前状态允许的动作。
8. 在接受真实订单前测试适用的取消或退款路径。

## 预期结果与验证

支付方式只有在有效能力交集就绪时才出现在 Checkout。观察必须绑定正确订单、资产、地址或 Provider Session、金额、状态与确认策略。源码里存在适配器或能解析 Token 标识都不等于可用。

## 失败与恢复

- 配置不完整或健康未知：停止展示新支付路径，但保留已有订单恢复能力。
- 观察到错误金额或目的地：不要自动结算。
- `awaiting_seller_receipt`：不要显示成“买家付款慢”，此时卖家资金目标尚未准备完成。
- Provider 或钱包动作失败：保留 Order ID 与 Payment Session ID 后再重试。
- 没有退款路径：在接受该方式前向买家披露限制。

## 继续

- [运营订单](/zh/sell/orders)
- [跟踪付款与订单](/zh/buy/order-status)
- [English canonical page](/sell/payments)
