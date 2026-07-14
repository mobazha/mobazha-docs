---
title: 开设并运营 Mobazha 店铺
summary: 从店铺设置进入商品、付款准备、履约和订单恢复，同时明确运营责任。
status: Beta
audiences:
  - 卖家
  - 运营者
evidenceLabel: Mobazha README 与发布范围
evidenceUrl: https://github.com/mobazha/mobazha/tree/main
reviewed: 2026-07-14
translationOf: sell
pageType: hub
outcome: 准备一个买家能够理解、付款并完成收货，而且已经通过完整流程验证的店铺。
estimatedTime: 6 分钟
journey: use
primaryAction:
  label: 准备店铺
  href: /zh/sell/store-setup
featuredVisual: seller-operating-loop
---

## 从店铺旅程开始

- [理解从 Offer 到履约的模型](/zh/project/offer-to-fulfillment) — 区分产品结构、陈列、供应事实、已接受条款和履约证据。
- [准备店铺](/zh/sell/store-setup) — 验证身份、政策、履约和一次完整测试购买。
- [发布商品](/zh/sell/listings) — 提供买家可核对的产品、规格、价格和可用性数据。
- [配置配送](/zh/sell/shipping) — 匹配目的地、费率、商品、时效和证据。
- [准备收款](/zh/sell/payments) — 只公开后端和运营者已经准备支持的能力。
- [运营订单](/zh/sell/orders) — 安全处理付款对账、履约、退款、争议和完成。

## 卖家运营的对象

| 对象 | 卖家责任 | 产品边界 |
|---|---|---|
| Store / Node | 身份、政策、能力、订单和业务状态权威 | 它不只是可视店面或渠道账号。 |
| Storefront | 品牌、导航、展示、域名和受众视图 | 在支持时，多个店面或渠道可复用店铺拥有的交易状态。 |
| Listing revision | 买家可见承诺：产品结构、选项、价格、媒体、条款和履约资格 | 新版本不能悄悄改变已经接受的 Quote 或订单。 |
| Supply 与 Availability | 某个可购买组合是否真的能够履约 | 库存、服务商供应、服务容量和选项标签是不同事实。 |
| Collection 与 Discount | 商品陈列和价格调整规则 | 它们组织或转换 Offer，但不拥有订单状态。 |
| Shipping profile | 目的地资格、服务、费率、时效和证据要求 | 对目的地没有有效履约路径时，商品不应可购买。 |
| Payment capability | 后端声明且运营者已准备好的付款路径 | 仅识别 Token 或服务商名称不等于就绪。 |
| Order | 已接受条款、付款状态、履约义务、恢复和完成 | 即使订单显示在其他渠道，后端仍是权威。 |

## 开店前

- 选择自行托管或可选托管服务。
- 配置后端和所在地区支持的付款方式。
- 发布买家可以查看的配送、退货、退款和争议条款。
- 接单前复核最终 Quote 以及所有收款方金额。

## Mobazha 不会替你决定的事项

卖家仍负责产品合法性、税务、履约、客户支持和卖家自定义收费。Mobazha 提供交易软件和可验证流程，不会让所有运营者成为同一法律实体。

> **Important:** 成本标签必须说明收款方和原因，不能用模糊的隐藏服务费代替。

## 店铺就绪检查清单

- 设置可识别的店铺身份、运营者联系路径、Locale、货币显示和适用域名。
- 创建包含准确规格、库存或可用性、媒体、价格和配送资格的完整商品。
- 接单前配置 Shipping Profile、配送时效、退货条件和履约证据。
- 只启用后端声明且店铺有能力监控和结算的付款方式。
- 在与客户相同的部署、能力集合和设备类型上测试完整买家流程。

## 订单运营

- 确认订单前复核 Order、Quote、付款状态、买家指令和履约义务。
- 不要根据截图、消息或 Agent 声明推断付款完成；使用后端验证后的付款状态。
- 通过订单流程记录发货或交付证据，不能只依赖外部聊天。
- 根据当前订单允许的状态转换处理取消、退款、争议和完成。
- 保留支持或争议审阅需要的政策、Quote、付款、履约和沟通引用。

## 选择运营方式

- [使用托管应用](https://app.mobazha.org)
- [选择部署方式](/zh/start/choose-deployment)
- [安装自行托管 Node](/zh/self-host/install)
- [理解收费](/zh/project/fees)
- [English canonical page](/sell)
