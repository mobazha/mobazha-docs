---
title: 通过 Mobazha 开店与销售
summary: 从店铺准备、商品发布、报价与付款，到订单履约和售后，保持责任与成本透明。
status: Beta
audiences:
  - 卖家
  - 运营者
evidenceLabel: Mobazha Node 与 Unified 公开实现
evidenceUrl: https://github.com/mobazha/mobazha-unified
reviewed: 2026-07-06
translationOf: sell
pageType: hub
outcome: 准备一个买家能理解、付款并完成收货验证的店铺旅程。
estimatedTime: 6 分钟
journey: use
primaryAction:
  label: 检查开店条件
  href: /zh/sell#开店前
featuredVisual: seller-operating-loop
---

## 开店前

- 选择托管服务或自行托管。
- 配置后端和所在地区实际支持的付款方式。
- 公开配送、退货、退款和争议条款。
- 在接受订单前检查最终报价和所有收款方金额。

- [理解从 Offer 到 Fulfillment 的经营模型](/zh/project/offer-to-fulfillment)

## 卖家实际经营的对象

| 对象 | 负责什么 | 边界 |
|---|---|---|
| Store / Node | 身份、政策、能力、订单和业务状态权威 | 不只是一个视觉店面或渠道账号。 |
| Storefront | 品牌、导航、页面、域名和受众视图 | 可以复用店铺商业状态，但不拥有订单。 |
| Listing revision | 商品形态、规格、价格、媒体、条款和履约资格 | 新版本不能静默修改已接受的 Quote 或订单。 |
| Supply / availability | 某个可购买组合能否真实履约 | 库存、供应商供给、服务容量和规格名称是不同事实。 |
| Collection / Discount | 组织商品和调整价格 | 影响展示或 Quote，不拥有订单状态。 |
| Shipping profile | 目的地、服务、费率、时效和证据要求 | 没有有效履约路径，商品不能对该目的地成交。 |
| Payment capability | 后端声明且运营者准备好的收款路径 | 仅能解析 Token 或服务商名称不等于可用。 |

## 店铺与商品准备

- 设置可识别的店铺身份、联系方式、地区、币种展示和域名。
- 为商品提供准确的规格、库存、图片、价格和配送范围。
- 先配置配送模板、预计时间、退货条件和履约证据。
- 只启用后端公开且店铺有能力监控、结算的付款方式。

## 订单运营

- 确认订单前检查报价、付款状态、买家要求和履约义务。
- 不要用截图、聊天消息或 Agent 陈述代替后端验证后的付款状态。
- 通过订单流程记录发货或交付证据。
- 取消、退款、争议和完成必须遵循当前订单允许的状态转换。

## 继续

- [打开托管应用](https://app.mobazha.org)
- [收费与经济模式](/zh/project/fees)
- [English canonical page](/sell)
