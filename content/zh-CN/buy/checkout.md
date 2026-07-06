---
title: 完成一次买家结账
summary: 创建或付款前，检查一个店铺、一份 Quote 和一组订单绑定的支付事实。
status: Beta
audiences:
  - 买家
  - Agent
evidenceLabel: Unified Checkout 路由与 Node 订单契约
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/checkout
reviewed: 2026-07-06
translationOf: buy/checkout
pageType: task
lastTested: 2026-07-04
outcome: 从已审阅的卖家 Quote 创建一笔订单，并保留恢复订单所需标识。
estimatedTime: 5–10 分钟
journey: use
primaryAction:
  label: 开始结账检查
  href: /zh/buy/checkout#开始前
---

## 开始前

- 核对店铺身份、商品、数量、规格、履约方式和退货政策。
- 使用连接到目标店铺与后端的当前浏览器上下文。
- 确认使用账户结账还是店铺可选的 Guest Checkout。
- 在订单显示资金目标、金额和有效期前不要发送资金。

> **Warning:** 不要复用其他订单、消息、截图或 Agent 回复中的地址、二维码、Quote 或金额。

## 结账步骤

1. 打开 `/product/{slug}`，核对卖家与店铺上下文，选择规格并加入购物车。
2. 在 Cart 中确认每一行属于目标卖家；发现市场或推荐关系不能静默成为订单所有者。
3. 进入 `/checkout`，只输入订单所需联系与配送数据，并在需要时选择对目的地有效的 Shipping 方式。
4. 核对商品小计、配送、折扣、税费、网络或 Provider 成本、可选服务与最终总额。
5. 在 Payment Method 步骤选择后端与店铺政策当前允许的方式。
6. 如果 Product Mode 要求 Moderator 或其他保障选择，确认其范围与费用。
7. 只有在卖家、收款方、总额、支付资产或 Provider、政策与保障选择均可见时才确认订单。
8. 保存 Order ID 与跟踪链接，并只使用订单绑定的 Payment Session 付款。

## 预期结果与验证

应用创建一笔具有权威状态和 Payment Session 的订单。核对 Listing revision、卖家、后端、总额、canonical 支付资产或 Provider、Funding Target、Settlement Mode、金额和有效期与最终确认一致。

## 失败与恢复

- Quote 过期：重新请求，不要发送旧金额。
- 商品不可用：返回购物车重新评估，不要重复提交订单。
- 资产或资金目标意外变化：停止并核对店铺与后端身份。
- 创建订单后丢失页面：使用保存的 Order ID 或跟踪链接。
- 已付款但状态不前进：保留 Transaction ID、Order ID 与 Payment Session ID，并查看订单状态排障。

## 继续

- [跟踪付款与订单状态](/zh/buy/order-status)
- [取消、退款或争议](/zh/buy/cancel-refund-dispute)
- [English canonical page](/buy/checkout)
