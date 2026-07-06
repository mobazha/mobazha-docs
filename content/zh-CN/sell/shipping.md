---
title: 配置配送与交付
summary: 明确商品能送到哪里、买家支付多少配送费用，以及卖家在履约后记录什么证据。
status: Beta
audiences:
  - 卖家
  - 运营者
evidenceLabel: Unified Shipping Profile 与 Node Listing 契约
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/settings/shipping
reviewed: 2026-07-06
translationOf: sell/shipping
pageType: task
lastTested: 2026-07-04
outcome: 只向买家展示对商品和目的地有效的配送方式，并把已选择的交付承诺保留在订单中。
estimatedTime: 15–30 分钟
journey: use
primaryAction:
  label: 检查配送要求
  href: /zh/sell/shipping#开始前
---

## 开始前

- 列出发货地、支持目的地、配送服务、预计时间与计价规则。
- 明确哪些 Listing revision 使用哪个 Shipping Profile。
- 公开不支持区域、海关责任、追踪能力、退货与异常处理。

## 配送如何进入订单

| 阶段 | 权威事实 | 必须避免 |
|---|---|---|
| Shipping Profile | `/admin/settings/shipping` 中的区域、服务、费率、时效和条件 | 假设一个全局费率适用于所有商品和目的地。 |
| Listing 绑定 | 实物商品版本绑定了有效 Profile | 商品已经发布，但买家目的地没有任何履约路径。 |
| Quote | 目的地和所选服务产生买家可见运费与时效 | 地址、数量或 Profile 变化后仍复用旧估算。 |
| 订单快照 | 已接受的服务、金额、目的地义务和卖家承诺保留在订单中 | 后续修改 Profile 时重写已有订单。 |
| 履约证据 | 承运商、追踪号、交接证明或适合商品类型的其他记录 | 没有适当证据就标记已履约。 |

## 配置步骤

1. 打开 **Admin → Settings → Shipping**（`/admin/settings/shipping`）。
2. 创建或选择代表一组一致履约政策的 Shipping Profile。
3. 添加目的地区域，确保区域重叠是有意且可以解释的。
4. 添加买家可见的服务名称、金额、币种、条件和预计时间。
5. 在实物 Listing 的 **Shipping** 区域绑定 Profile；不要为了通过结账给数字商品或服务添加虚假运费。
6. 使用区域内、区域外和边界地址分别请求新 Quote。
7. 完成测试订单，并通过订单流程记录追踪或交付证据。

## 预期结果与验证

Checkout 只应显示对当前商品和目的地有效的配送方式。所选运费进入最终金额，并与创建后的订单和交付义务一起保留。修改 Profile 后，新 Quote 应反映新规则，已有订单仍保留原始承诺。

## 失败与恢复

- 没有配送方式：检查地址标准化、Profile 绑定、Listing 类型和区域覆盖。
- 出现重复方式：检查重叠区域与重复 Profile 绑定。
- Checkout 金额不同：停止接受订单并核对币种、计价基础和 Quote。
- 无法保存追踪：先安全保留证据，再通过支持的状态转换重试并报告缺陷。

## 继续

- [准备收款方式](/zh/sell/payments)
- [运营订单](/zh/sell/orders)
- [English canonical page](/sell/shipping)
