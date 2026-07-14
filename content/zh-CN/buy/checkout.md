---
title: 完成买家 Checkout
summary: 创建或资助订单前，核对一个店铺、一份 Quote 和一套付款指示。
status: Beta
audiences:
  - 买家
  - Agent
evidenceLabel: Unified Checkout 路由与 Node 订单合约
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/checkout
reviewed: 2026-07-14
translationOf: buy/checkout
pageType: task
lastTested: 2026-07-04
outcome: 从已核对的卖家 Quote 创建订单，并保留恢复所需标识符。
estimatedTime: 5–10 分钟
journey: use
primaryAction:
  label: 开始 Checkout 检查
  href: /zh/buy/checkout#开始前
---

## 开始前

- 核对店铺身份、商品、数量、Variant、履约方式与退货政策。
- 使用连接到目标店铺与后端的当前浏览器会话。
- 确定使用账号 Checkout，还是店铺可选的 Guest Checkout。
- 准备准确的付款资产；在订单显示地址、金额和过期时间前不要转账。

> **Warning:** 绝不要复用其他订单、消息、截图或 Agent 回答中的地址、QR code、Quote 或金额。

## Checkout 步骤

1. 打开 `/product/{slug}`，核对卖家与店铺上下文，选择必填选项并加入购物车。
2. 打开 **Cart**，确认每项商品属于目标卖家。Marketplace 可以组织发现并记录 attribution，但必须由获准卖家而不是 Marketplace projection 拥有 Checkout handoff 和产生的订单。
3. 继续到 `/checkout`；只填写此订单需要的交付与联系资料，并在需要时选择适用于目的地的配送方式。
4. 核对商品小计、运费、折扣、税费、网络或服务商成本、可选服务与最终总额。
5. 在付款方式步骤选择当前可用方式。可用性来自连接的后端与店铺政策，而不是本指南中的静态列表。
6. 如果订单模式要求 moderator 或其他保障选择，确认前查看其范围与成本。
7. 只有在卖家、收件人、最终总额、付款资产或服务商、适用政策及保障选择都清晰可见时才确认订单。
8. 确认后保存订单标识符与追踪链接，再从订单绑定的 Payment Session 取得地址、服务商 payload、金额、过期时间与进度。

## 预期结果与验证

应用应显示带有权威状态和订单绑定 Payment Session 的新订单。核对商品版本、卖家、卖家拥有的后端、总额、canonical payment asset 或 provider、funding target、金额、settlement mode 与 expiry 是否和最终确认一致。Marketplace 页面或 referral 标签不是卖家，不得静默成为订单 owner。

不要把钱包广播、截图或 pending transaction 当作付款完成。等待订单页报告所需确认数与 funded 状态。

## 失败时

- Quote 过期时返回 Checkout 请求新 Quote，不要发送旧金额。
- 商品变为不可用时返回 Cart 重新评估，不要反复提交。
- 付款资产或目的地意外变化时停止操作，核对店铺与后端身份。
- 订单已创建但页面丢失时，使用已保存的订单标识符或 Guest Order 追踪链接。
- 资金已发出但状态未推进时，保留 transaction ID 与 order ID，并按[订单状态故障排查](/zh/buy/order-status)处理。

## 继续

- [安全使用 Guest Checkout](/zh/buy/guest-checkout) — 不附加卖家或管理员会话即可购买。
- [追踪付款与订单状态](/zh/buy/order-status) — 理解当前状态能证明什么。
- [取消、退款与争议](/zh/buy/cancel-refund-dispute) — 只使用当前订单可用的转换。
- [English canonical page](/buy/checkout)
