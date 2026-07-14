---
title: 安全使用 Guest Checkout
summary: 创建不绑定买家账号的订单，同时保留店铺路由上下文和可恢复的追踪链接。
status: Beta
audiences:
  - 买家
  - 卖家
  - Agent
evidenceLabel: Unified Guest Checkout 实现与 Node 公开 Guest API
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/packages/core/services/api/guestCheckout.ts
reviewed: 2026-07-14
translationOf: buy/guest-checkout
pageType: task
lastTested: 2026-07-04
outcome: 创建一笔不把买家账号附加到请求、并且可以恢复的订单。
estimatedTime: 5 分钟
journey: use
primaryAction:
  label: 检查 Guest Checkout 就绪状态
  href: /zh/buy/guest-checkout#开始前
---

## 开始前

- 店铺必须展示 Guest Checkout，并至少有一种就绪的付款方式。
- 在同一个店铺完成购物车；Guest Checkout 不会合并无关店铺上下文。
- 准备立即保存生成的订单 token 或追踪链接；两者都丢失后可能难以恢复订单。
- Guest Checkout 提供匿名 transport，不代表可以豁免店铺政策、付款确认或合法交付所需信息。

## Guest Checkout 步骤

1. 把符合条件的商品加入购物车并继续 Checkout。
2. 在店铺提供该选项时选择 **Guest Checkout**。
3. 提交个人信息前，查看交付字段与卖家政策。
4. 让应用请求 Supply Quote；它仅供参考，本身不会保留库存。
5. 从后端当前展示的付款方式中选择一种。
6. 创建订单后，立即把订单 token 或买家追踪链接保存到当前分页之外。
7. 只按显示的地址与金额，在显示的过期时间前付款。
8. 重新打开追踪链接，查看确认、配送证据与完成状态。

## 预期结果与验证

买家请求不应携带管理员、卖家或之前存储的用户凭据。请求可以保留同源店铺路由上下文，以到达正确店铺。追踪页面应显示订单 token、付款资产、付款目的地、所需确认数、过期时间和里程碑状态。

| 里程碑 | 含义 | 不能证明 |
|---|---|---|
| Awaiting payment | 订单已存在，等待所显示的付款 | 资金已结算 |
| Funded | 后端已接受所需付款证据 | 实体商品已送达 |
| Shipped | 卖家已记录发货或交付证据 | 买家已经收到或接受商品 |
| Completed | 订单到达完成转换 | 所有外部陈述或保修都得到保证 |

## 失败时

- 没有 Guest Checkout 时，后端可能已禁用、未通过就绪检查，或要求账号 Checkout。
- 追踪链接丢失时，不要创建多笔已付款订单；用脱敏付款证据联系卖家。
- 既有登录似乎影响 Guest 请求时，停止操作并报告可复现的客户端缺陷。
- 付款过期时，不要在未刷新订单指示的情况下付款。

## 安全与隐私

只向确有需要的参与方分享追踪链接。不要公开发布订单 token、交付资料或交易证据。Agent 可以帮助解释流程，但没有明确确认时不得创建或资助订单。

- [English canonical page](/buy/guest-checkout)
