---
title: 创建并验证 Listing
summary: 发布一项准确说明选项、价格、可用性、履约和买家可见条款的商品。
status: Beta
audiences:
  - 卖家
evidenceLabel: Unified Listing 编辑器与 Node Listing API
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/listing
reviewed: 2026-07-14
translationOf: sell/listings
pageType: task
lastTested: 2026-07-04
outcome: 发布一项买家能够理解、取得 Quote，并通过预定履约路径购买的 Listing。
estimatedTime: 15–30 分钟
journey: use
primaryAction:
  label: 准备 Listing 输入
  href: /zh/sell/listings#开始前
---

## 开始前

- 准备真实的标题、说明、媒体、价格、数量或服务容量，以及交付条件。
- 确定商品是实体、数字内容、服务，还是其他受支持的 Listing 类型。
- 发布前配置必要的配送或交付支持。
- 不要因为 Token 或付款能力的标识符可以解析，就把它写成可用。

## 选择正确的创建入口

| 入口 | 适用场景 | 可用性说明 |
|---|---|---|
| `/admin/products` | 检查发布状态、可用性、价格与既有 Listing。 | 主要管理表面。 |
| `/listing/new` | 使用商品类型字段、媒体、选项、价格和履约信息创建完整 Listing。 | 首个代表性商品的首选入口。 |
| `/listing/quick` | 以较少字段开始，再补全 Listing。 | 只在当前 distribution 提供该入口时使用。 |
| `/listing/import` 或 Admin import | 将外部目录数据规范化为 Mobazha Listing 与供给事实。 | 导入后仍须卖家审核与发布。 |
| `/admin/collections` | 把已发布 Listing 整理为买家可见的分组。 | 只负责陈列，不改变订单权威。 |
| `/admin/discounts` | 定义适用的价格调整与优惠码。 | 已接受的 Quote 必须显示应用后的结果。 |

## 分开处理商品形态、选项与供给

| 事实 | 示例 | 为什么要分开 |
|---|---|---|
| 商品类型 | 实体商品、数字商品、服务、收藏品或其他受支持类型 | 决定必填的履约与买家可见字段。 |
| 选项 | 颜色、尺寸、授权等级、服务时长 | 买家选择的 Offer 属性。 |
| Variant / SKU | 蓝色 + 大号，或 Pro + 年付 | 标识可购买组合，不代表供应商身份。 |
| 可用性 | 库存、服务商供给、服务容量或资格 | 回答该组合目前能否履约。 |
| 履约 | 配送模板、数字交付、预约、兑换或服务商路径 | 回答如何兑现已接受的承诺。 |

## Listing 步骤

1. 打开 **Admin → Products**，确认当前店铺；第一个代表性 Offer 使用完整的 `/listing/new` 入口。
2. 先选择商品类型，再填写标题、说明、分类、买家可见媒体和类型专属事实。
3. 使用正确精度填写价格与币种；以渲染金额为准，不要只信任存储的整数单位。
4. 添加选项维度与 Variant。只在受支持且确有用途时，为每个可购买组合设置有意义的 SKU 或标识。
5. 把可用性与选项名称分开配置：本地库存、服务容量、服务商供给或其他受支持来源。
6. 按商品类型和目的地分配配送、数字交付、服务履约、兑换或其他有效路径。
7. 加入卖家实际能够履行的退货、退款、保修、资格或兑换条件。
8. 保存 Draft，在买家上下文预览 `/product/{slug}`，然后发布。
9. 适用时将 Listing 加入 Collection 或设置 Discount；随后请求新 Quote 并核对结果，不要假设陈列变更已正确进入订单。

## 预期结果与验证

在买家上下文打开公开商品 URL，核对标题、媒体、商品类型、选项、Variant 可用性、显示价格、卖家身份、政策和适用于目的地的履约方式。把商品加入购物车并请求新 Quote，继续到 Checkout 出现有效的配送和付款路径；发布成功本身不能证明 Offer 可以生成订单。

## 失败时

- 商品已保存但未公开时，检查发布状态、Storefront 上下文、索引与运行时能力。
- 某选项无法购买时，检查 Variant 完整性与可用性。
- 价格渲染错误时，停止发布并核对金额单位、币种和精度。
- 无配送方式时，将 Listing 分配到适用模板并重新测试买家目的地。
- 导入或服务商供给的商品已公开但不可用时，检查规范化后的 Supply 记录，不要在选项字段中虚构库存。

## 变更安全

编辑已有活跃订单的 Listing 时，保留买家已接受的版本和条款。新 Listing 版本不得静默改写已创建订单。

- [English canonical page](/sell/listings)
