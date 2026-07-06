---
title: 跟踪付款与订单状态
summary: 在判断订单已入资、已履约、可退款或已完成前，对账 Payment Session 证据与后端订单状态。
status: Beta
audiences:
  - 买家
  - 支持人员
  - Agent
evidenceLabel: Unified 订单里程碑、PaymentSession 与 Node Order API
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/packages/core/hooks/useOrderDetail.ts
reviewed: 2026-07-06
translationOf: buy/order-status
pageType: task
lastTested: 2026-07-04
outcome: 理解当前状态证明了什么，以及下一步可以安全执行哪个恢复动作。
estimatedTime: 3 分钟
journey: use
primaryAction:
  label: 对账一笔订单
  href: /zh/buy/order-status#开始前
---

## 开始前

- 准备 Order ID 或 Guest Order Token，以及支付交易或 Provider 引用。
- 使用创建订单的同一店铺和后端。
- 不要在支持聊天中粘贴私钥、助记词、完整客户资料或带鉴权的跟踪链接。

## 跟踪步骤

1. 打开账户 Orders，或保存的 Guest Order 跟踪链接。
2. 先核对卖家、商品、金额、支付资产和创建时间。
3. 打开订单绑定的 Payment Session，对照 Session ID、canonical 资产、Funding Target、金额、Settlement Mode 和有效期。
4. 分别查看已观察金额、剩余金额、Observation、确认数和后端 Funding State。
5. 事件通知变化时，通过产品界面或 `GET /v1/orders/{orderID}/payment-session` 刷新权威状态。
6. 执行下一动作前保存履约、取消、退款或争议证据。

## 预期结果与验证

订单页显示由后端拥有的业务状态。WebSocket、钱包或 Provider 通知只是刷新信号。Payment Session 的 Capabilities 而不是静态按钮列表，决定当前能否刷新、取消、确认、退款或完成。

| 观察 | 可以安全得出的结论 |
|---|---|
| Funding Target ready | 订单存在有效期内可使用的地址或 Provider Session |
| Transaction broadcast | 钱包尝试广播交易 |
| Transaction observed | 支付系统观察到候选交易 |
| 达到所需确认数 | 配置的确认门槛可能已满足 |
| Backend funded | 订单后端已接受这笔订单的支付证据 |
| Seller fulfilled | 卖家记录了履约证据，仍应检查证据内容 |

## 失败与恢复

- 没有观察到交易：核对资产、网络、目的地、金额和有效期，不要立即重复付款。
- 钱包确认但订单仍待付款：私下向运营者提供最小化 Order ID 与 Transaction ID。
- 多个界面状态冲突：停止自动动作并报告一致性缺陷。
- 跟踪链接打不开：确认它属于当前部署且没有被截断。

## 继续

- [取消、退款或争议](/zh/buy/cancel-refund-dispute)
- [English canonical page](/buy/order-status)
