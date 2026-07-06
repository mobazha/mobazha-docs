---
title: 从 Offer 到 Fulfillment
summary: 把产品形态、Listing 修订、Collection、Discount、供应事实、交付选择与履约证据连接起来，同时不把展示误认为卖家已经接受的义务。
status: Beta
audiences:
  - Sellers
  - Buyers
  - Operators
  - Developers
  - Evaluators
evidenceLabel: Mobazha 公开 Listing、Collection、Discount、Shipping、Supply、Fulfillment、Quote 与 Order 契约
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
pageType: concept
outcome: 为可销售 Offer 及其履约路径建立模型，同时保留现有订单已经接受的事实。
estimatedTime: 10 分钟
journey: use
primaryAction:
  label: 查看卖家旅程
  href: /zh/sell
featuredVisual: offer-to-fulfillment
translationOf: project/offer-to-fulfillment
---

## 一个可销售承诺，多个支撑模型

买家把商品页体验为一个 Offer。Mobazha 在背后保持多个关注点分离，避免 Merchandising、供应自动化或 Fulfillment 变化暗中重写卖家的义务。

| 关注点 | 它拥有什么 | 它不拥有什么 |
|---|---|---|
| 产品或服务形态 | 买家可见描述、Option、媒体，以及承诺商品或结果的性质 | 支付状态或履约完成状态 |
| Listing Revision | 卖家当前零售条款、价格、可售性、政策和可用履约路径 | 已被现有订单接受的条款 |
| Collection 或展示 | 分组、排序、过滤与发现上下文 | Listing 的第二份副本或另一套库存账本 |
| Discount | 有边界的价格规则及其资格条件 | 基础 Listing、支付验证或历史订单总额 |
| Supply Binding | 与卖家库存、容量或外部供应源的关系 | 未经政策允许发布卖家 Draft 或更改零售条款的权威 |
| Fulfillment Plan | 如何交付已接受义务并形成证据 | 绕过获准状态迁移推进订单的权限 |

稳定单元不是一个 Product Type 标签，而是一个由卖家拥有、能够被报价、接受进订单、完成履约并通过保留证据解释的承诺。

## 产品形态、供应来源和履约路径相互独立

“实体”“数字”“服务”或某个垂直品类可以帮助选择字段和买家文案，但一个标签不应决定整笔交易。需要分别回答三个问题：

1. **承诺了什么？** 商品、访问权、文件、License、预约、容量或其他受支持结果。
2. **可售性从哪里来？** 卖家持有库存、卖家管理的容量，或显式配置的外部供应源。
3. **如何履约？** 卖家配送、自提、数字交付、服务完成、外部 Fulfillment Provider，或其他带版本契约。

这种分离支持多种经营模式，而不必为每个 Provider 或 Vertical 发明新的万能 Product Type。

| 示例形态 | 可能的供应事实 | 可能的履约事实 |
|---|---|---|
| 实体商品 | 卖家数量或外部供应商可用性 | 卖家发货、自提或 Provider 发货 |
| 数字商品 | License、Entitlement 或有边界的可用性 | 下载、Key、账户授权或其他受支持交付记录 |
| 服务或容量 | 时间、Quota、Seat 或运营者可用性 | 预约、完成、兑换或 Attestation |
| 收藏品或专业 Vertical | 实体、数字、Tokenized 或混合事实 | 只使用显式支持的 Shipping、Delivery 或 Extension 契约 |

这些示例用于建模，不代表每个发行版都支持所有组合。

## Listing 是卖家当前 Offer

有用的 Listing 应使可销售承诺可以检查：

- 卖家和店铺 Identity；
- 标题、描述、媒体、Option 与买家可见状态；
- 零售价、币种、税费和卖家定义费用；
- 数量、容量或其他 Availability Signal；
- 可用 Shipping、Delivery、Redemption 或 Service 条件；
- 退货、退款、保修、资格及其他适用政策；
- 发布状态和 Revision 证据。

发布 Listing 并不证明它一定可购买。Checkout 仍需要兼容的店铺上下文、可用 Supply、Delivery Path、Payment Capability 与有效 Quote。

- [查看英文 Listing 创建与验证指南](/sell/listings)
- [查看英文首单准备指南](/sell/store-setup)

## Collection 与 Storefront 改变发现，不改变所有权

Collection 可以为浏览分组和排序卖家 Listing；Storefront 可以对同一店铺应用 Catalog Filter 或展示规则；Community Market 可以投影多个同意加入的店铺的选定 Offer。

它们都是对权威 Listing 的可组合视图：

- 从 Collection 移除商品不会删除 Listing；
- 改变 Storefront Filter 不会改变父店铺已经接受的订单；
- 在市场中推荐商品不会转移卖家或支付权威；
- Projection 丢失时应从 Listing Source 修复，而不是把它当成新的库存真相。

手动或规则驱动的组织、Sort Mode、Visibility 和 Filtering 仍取决于 Capability。展示视图改变价格表达时，最终 Quote 必须标明应用规则和接受金额。

- [理解 Identity、店铺与 Storefront](/zh/project/identity-and-stores)
- [理解社群市场与策展](/zh/project/community-commerce)

## Discount 先成为 Quote 事实，再成为 Order 事实

在受支持时，Discount 可以自动应用，也可以要求显式 Code 或条件；它可以针对特定商品、Collection、Store、数量、Buyer 或时间窗口。有效规则必须在确认前评估，并显示在最终成本明细中。

安全顺序是：

1. 根据当前 Cart、Identity、Store、时间与规则状态评估资格；
2. 使用明确币种和舍入行为计算 Discount；
3. 在 Quote 中标明 Discount 及其对收款方的影响；
4. 把接受结果快照进 Order；
5. 在不重写历史的前提下执行使用次数、过期、取消、退款与撤销规则。

后续 Promotion 修改不能改变现有订单总额。前端标签也不足以证明某个 Discount 已被接受。

## Supply 自动化为 Offer 提供信息，但不拥有 Offer

外部 Supply 或 Fulfillment Provider 可以贡献 Catalog Data、Availability、Supplier Cost、Shipping Estimate、Production Status 和 Tracking。Mobazha 可以把 Provider Product 绑定到 Store Listing，并把 Supplier Work 绑定回 Store Order。

边界仍需明确：

- Provider 拥有自己的外部 Catalog、Job 与 Observation；
- Seller 拥有零售选品、Markup、Policy 和 Publication Decision；
- Core 拥有 Quote、Order、获准业务迁移与 Audit Trail；
- Credential、Webhook、Retry、Provider Failure 与 Reconciliation 留在配置好的集成边界内。

外部 Availability 不确定时，新购买应失败关闭，或按政策把受影响 Offer 设为不可用。自动化不能仅因为供应商恢复库存就发布卖家 Draft。

## Fulfillment 保留已接受义务

在 Checkout 中，买家只能选择对商品、目的地和当前 Capability 有效的 Delivery Option。被接受的 Order 保留所选 Service、Amount、Address 或 Delivery Target，以及适用条款。

付款和卖家接受后，Fulfillment 可以包含一次卖家管理的 Shipment，也可以包含多个明确的 Provider/Location Group。外部 Provider Status 是运营证据；Core 决定它是否足以推进订单。Tracking、Delivery、Digital Access、Service Completion、Pickup 或 Attestation 应通过受支持履约路径记录。

- [查看英文 Shipping 与 Delivery 指南](/sell/shipping)
- [查看英文卖家订单运营指南](/sell/orders)
- [沿着订单与支付交易主线理解状态](/zh/project/transaction-spine)

不要为了满足 UI 要求给数字商品或服务附加实体 Shipping。如果连接发行版缺少所需 Delivery Contract，该 Offer 就不能通过这条路径销售。

## 订单存在后的变更安全

买家接受 Quote 后，Listing、Collection、Discount、Supplier Cost、Shipping Profile、Provider 或 Storefront 的后续变化都不能暗中改变该 Order。应保留接受快照，并把后续 Fulfillment 与 Recovery Evidence 绑定到同一 Order Identity。

| 变化 | 新买家 | 现有订单 |
|---|---|---|
| Listing Price 或 Description | 使用新的获准 Revision | 保留已接受 Item 与 Price Snapshot |
| Collection 或 Featured Position | 使用新的 Discovery Projection | 不影响订单义务 |
| Discount Rule | 对新 Quote 重新评估 | 保留已接受 Discount 与 Total |
| Supply Availability 或 Cost | 重新评估准入与 Seller Policy | 对已接受义务进行 Reconcile，不重写义务 |
| Shipping 或 Provider Configuration | 只提供当前有效路径 | 服务持久绑定，或使用显式 Recovery Action |

## 当前契约与演进方向

| 范围 | 当前公开含义 | 必须标注为方向的内容 |
|---|---|---|
| Listings | 带版本 Seller Offer 承载买家可见 Item、Price、Availability、Policy 与 Fulfillment Data | 更丰富 Product Schema 与 Vertical-specific Authoring |
| Collections 与 Discounts | 启用时存在 Store-scoped Merchandising 和有边界 Pricing Contract | 更多 Rule Builder、Targeting、Analytics 与跨界面编辑 |
| Shipping | Profile 与买家选择的 Option 把 Delivery Eligibility 和 Cost 绑定到 Order | 更多 Carrier、Pickup 与区域集成 |
| External Supply 与 Fulfillment | Provider Contract 和持久 Listing/Order Mapping 可以把外部工作与 Core State 隔离 | 更多 Provider、Reconciliation Tool 与 Seller Control |
| Digital、Service 与专业履约 | Offer 必须使用显式支持的 Delivery 或 Extension Contract | 更多类型化 Delivery 和 Order-resource Provider |

连接后端的有效 Capability、适用 Release、Quote 与 Order Evidence 仍是权威。Product Label、Provider Package、Configuration Field 或内部计划都不会自动激活一条可销售 Fulfillment Path。

- [English canonical offer-to-fulfillment page](/project/offer-to-fulfillment)
