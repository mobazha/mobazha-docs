---
title: 为首笔订单准备店铺
summary: 在接受买家资金前，配置店铺身份、政策、履约、付款方式，并走完一条完整测试旅程。
status: Beta
audiences:
  - 卖家
  - 运营者
evidenceLabel: Unified 卖家管理路由
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin
reviewed: 2026-07-14
translationOf: sell/store-setup
pageType: task
lastTested: 2026-07-04
outcome: 发布一个不依赖隐藏运营步骤、能完成一条代表性买家旅程的店铺。
estimatedTime: 30–60 分钟
journey: use
primaryAction:
  label: 开始就绪检查
  href: /zh/sell/store-setup#开始前
---

## 开始前

- 选择托管或自行托管，并确认后端健康。
- 使用目标店铺的管理员身份，不要使用来自另一部署的买家会话。
- 准备公开店名、联系渠道、币种显示、履约地区、退货条款和付款方式。
- 将恢复材料保存在浏览器之外；进行重要配置变更前先创建备份。

## 先确认正在修改哪个表面

| 管理表面 | 当前路由 | 控制内容 |
|---|---|---|
| 店铺资料 | `/admin/settings/profile` | 公开运营者身份与资料信息。 |
| Storefront 编辑器 | `/admin/storefront` | 品牌、展示、区块与公开店面体验。 |
| 店铺政策 | `/admin/settings/policies` | 买家可见的履约、退货、退款、隐私与保障条款。 |
| 配送模板 | `/admin/settings/shipping` | 目的地资格、费率、时效与 Listing 覆盖。 |
| 付款 | `/admin/payments` | 支持时的加密货币收款账户、可用服务商、Guest Checkout 行为与付款政策。 |
| 商品 | `/admin/products` 与 `/listing/new` | Listing 版本、选项、可用性、价格与履约分配。 |

**Store / Node** 拥有身份、政策、能力和订单；**Storefront** 是这些商业状态的展示表面。一个账号能访问多个店铺时，修改任何一项前都要确认当前店铺上下文。

## 店铺设置步骤

1. 打开 **Admin → Settings → Profile**，核对当前店铺身份、公开运营者名称、联系渠道、地区设置与币种显示。
2. 打开 **Admin → Storefront**，只发布属于该店铺的品牌与区块；继续前先预览公开页面。
3. 打开 **Admin → Settings → Policies**，发布适合该运营者与付款模型的配送、退货、退款、隐私和买家保障条款。
4. 打开 **Admin → Settings → Shipping**，创建至少覆盖一个真实目的地和目标商品类型的模板。
5. 打开 **Admin → Payments**，只启用状态为就绪，且运营者能够监控、对账并在适用时退款的收款账户或服务商。
6. 打开 **Admin → Products** 或 `/listing/new`，创建一项完整 Listing，并配置有效的可用性与履约方式。
7. 在独立买家上下文中打开 `/store/{peerId}`，核对店铺身份、政策、Listing、Quote、配送和付款选择。
8. 使用测试网订单走完卖家接受、付款验证、履约证据，以及买家完成或预期终态。

## 预期结果与验证

公开 Storefront 应显示目标店铺身份、展示内容、政策、Listing 版本、完整价格组成、适用于目的地的配送方式，以及仅处于就绪状态的付款方式。管理员应能在同一店铺上下文中收到测试订单，并在不依赖隐藏工具的情况下检查付款与履约状态。

## 失败时

- 公开店铺与 Admin 不一致时，确认 Store / Storefront 上下文并刷新权威设置。
- Checkout 没有配送选项时，确认 Listing 已绑定适用的配送模板或数字交付路径。
- 付款方式缺失时，检查运行时就绪状态，不要只在前端补一个标识符。
- 买家与卖家路由意外共用凭据时，停止使用实质资金并报告隔离缺陷。
- 修改了错误店铺时，停止操作，先核对账号、Store / Node、Storefront 与 `peerId` 上下文。

## 继续

- [创建并验证 Listing](/zh/sell/listings)
- [配置配送](/zh/sell/shipping)
- [准备付款方式](/zh/sell/payments)
- [处理进店订单](/zh/sell/orders)
- [English canonical page](/sell/store-setup)
