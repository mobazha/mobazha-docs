---
title: 征求意见稿（RFC）
summary: 在把重大协议、政策、经济、安全、治理和跨仓库提案当成承诺前，先查看其状态与审阅记录。
status: Current
audiences:
  - 贡献者
  - 维护者
  - 评估者
  - Agent
evidenceLabel: Mobazha 公开 RFC 注册表
evidenceUrl: https://github.com/mobazha/mobazha-docs/tree/main/rfcs
reviewed: 2026-07-14
translationOf: project/rfcs
pageType: hub
outcome: 查找或发起公开提案，同时避免把 Draft 方向表述成已接受或已发布行为。
estimatedTime: 5 分钟
journey: understand
primaryAction:
  label: 打开 RFC 注册表
  href: /zh/project/rfcs#当前注册表
---

## 何时需要 RFC

- 公开协议或互操作契约发生变化。
- 订单、付款、结算、争议、身份、授权或保管边界发生变化。
- 费用、收款方、奖励、公共资金或经济政策发生变化。
- 新的可选托管依赖改变独立运行假设。
- 治理、许可、隐私、安全或跨仓库所有权发生实质变化。

## 状态模型

- **Draft：** 编写尚未完成。
- **Review：** 已准备好进行公开技术和产品审阅。
- **Accepted 或 Rejected：** 已记录决定及理由。
- **Withdrawn：** 作者不再提出该变更。
- **Superseded：** 由另一份 RFC 取代。
- **Implemented：** 发布证据确认已接受提案在明确范围内交付。

## 当前注册表

- [RFC-0001：创始白皮书发布契约](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0001-whitepaper-publication-contract.md) — Review；规定白皮书升级状态所需证据和批准。
- [RFC-0002：可组合扩展平台模型](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0002-composable-extension-platform.md) — Draft；区分领域、契约角色、运行时、信任、生命周期和打包。
- [RFC-0003：可组合前端产品模型](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0003-composable-frontend-product-model.md) — Draft；区分部署、体验、渠道、代码包含关系和有效能力。
- [RFC-0004：Deal Link 单层归因](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0004-deal-link-single-level-attribution.md) — 已由 RFC-0007 取代；保留早期仅人工审阅提案。
- [RFC-0005：Core 拥有的资源抵押品生命周期](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0005-core-owned-resource-collateral.md) — Draft；提出独立的 Core 抵押品聚合，不与 Order Extension 或订单结算状态合并。
- [RFC-0006：Payment Kernel、Rails 与可信分发模块](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0006-payment-kernel-rails-and-trusted-modules.md) — Draft；提出类型化支付轨道、经过审阅的模块组合、按贡献路由和持久恢复边界。
- [RFC-0007：卖家出资的 Affiliate 归因与原子结算](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0007-seller-funded-affiliate-atomic-settlement.md) — Draft；提出把卖家出资的 Affiliate 输出纳入权威订单 release，而不增加第二套付款引擎。
- [RFC-0008：Node 密钥域与收款架构](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0008-node-key-domains-and-receiving-architecture.md) — Draft；提出拆分 Identity、Wallet 和 Settlement 域，并为订单授权密钥设置生产门槛。
- [RFC-0009：冻结 Payment Attempt 结算条款](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0009-frozen-payment-attempt-settlement-terms.md) — Draft；提出在付款目标可用前冻结卖家付款、平台与取消费用、Affiliate、Moderator、Escrow 超时和争议政策。
- [RFC-0010：Guest Checkout 信任与保管模型](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0010-guest-checkout-trust-and-custody.md) — Draft；提出卖家保管的 Guest Checkout、逐链关闭门槛和订单 Scope 凭据。
- [RFC-0011：订单结算授权密钥](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0011-order-settlement-authorization-keys.md) — Draft；提出针对每个 attempt 的确定性硬化结算密钥，以及付款前 Moderator 可选性的密钥条件。
- [RFC-0012：内嵌钱包买家结算密钥与 Onramp 注资](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0012-embedded-wallet-buyer-settlement-keys.md) — Draft；提出由买家和卖家共同保管的参与者密钥类别，并允许经过审阅的内嵌钱包可信模块。
- [RFC 模板](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0000-template.md) — 必需 metadata 和审阅问题。
- [仓库 RFC 指南](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/README.md)

> **Important:** Accepted 与 Implemented 是不同状态。只有发布证据和有效运行时能力才能证明能力已经交付。

- [English canonical page](/project/rfcs)
