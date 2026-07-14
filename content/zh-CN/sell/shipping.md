---
title: 配置配送与交付
summary: 定义商品可送达范围、向买家收取的费用，以及卖家履约后记录的证据。
status: Beta
audiences:
  - 卖家
  - 运营者
evidenceLabel: Unified 配送模板与 Node Listing 合约
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/settings/shipping
reviewed: 2026-07-14
translationOf: sell/shipping
pageType: task
lastTested: 2026-07-04
outcome: 只提供适用于买家目的地、并会保留在已创建订单中的交付方式。
estimatedTime: 15–30 分钟
journey: use
primaryAction:
  label: 梳理交付要求
  href: /zh/sell/shipping#开始前
---

## 开始前

- 列出发货地、支持的目的地、交付方式、预计时间与计价规则。
- 确定每个配送模板适用哪些 Listing。
- 说明不配送地区、关税责任、追踪能力与退货处理方式。

## 配送如何进入 Mobazha 订单

| 阶段 | 权威事实 | 要避免的错误 |
|---|---|---|
| 配送模板 | 在 `/admin/settings/shipping` 配置的区域、服务、费率、时效与条件 | 把一个全局费率视为适用于所有 Listing 和目的地。 |
| Listing 分配 | 实体商品版本在 Listing 的 Shipping 区块绑定适用模板 | 发布无法送达买家目的地的商品。 |
| Quote | 目的地与所选服务生成买家可见的运费与时效 | 地址、数量或模板变更后继续复用目录估算。 |
| 订单快照 | 已接受的交付服务、金额、目的地义务与卖家承诺保留在订单中 | 让后续模板编辑静默改变既有订单。 |
| 履约证据 | 承运商、追踪号、交接、数字证明、服务完成或其他受支持记录 | 没有适合商品类型的证据就把订单标为已履约。 |

## 配送设置步骤

1. 打开 **Admin → Settings → Shipping**（`/admin/settings/shipping`）。
2. 创建或选择代表一套一致履约政策的模板。
3. 添加目的地区域，确保重叠是有意且易于理解的。
4. 添加买家可见的服务名称、金额、币种、条件与预计送达时间。
5. 打开每项实体 Listing 的 **Shipping** 区块并分配适用模板；移除数字商品、服务或需要其他交付路径的商品。
6. 保存后测试区域内、区域外及每个支持区域边界上的地址。
7. 完成测试订单，并通过订单流程记录承运商、追踪号或其他交付证据。

## 预期结果与验证

Checkout 应只显示适用于商品和目的地的交付方式。所选运费必须出现在最终成本明细中，并与已创建订单关联；卖家订单视图应保留所选服务与义务。

修改模板后，测试一份新 Quote，同时确认已经接受的订单仍显示原始交付承诺。

## 失败时

- 没有选项时，检查目的地规范化、模板分配、Listing 类型与区域覆盖。
- 出现重复选项时，检查重叠区域与重复模板分配。
- Checkout 金额与配置不符时，停止接单并核对币种与计算基准。
- 无法保存追踪信息时，私下安全保存引用并报告状态转换缺陷。

## 数字商品与服务

不要为了让 Checkout 通过而给数字商品或服务附加实体运费。应使用受支持的交付合约，并分别说明访问、预约、兑换或证据。

- [English canonical page](/sell/shipping)
