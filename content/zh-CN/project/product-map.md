---
title: Mobazha 产品地图
summary: Mobazha 把独立经营的店铺、Core 权威商业状态机、可选服务、社群分发和受控自动化连接起来，而不是把它们重新封装成一个不透明平台。
status: Beta
audiences:
  - 买家
  - 卖家
  - 运营者
  - 开发者
  - 评估者
evidenceLabel: Mobazha 公开架构、发布与政策文档
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
translationOf: project/product-map
pageType: concept
outcome: 理解 Mobazha 的长期产品模型、权威边界，以及当前发布证据在哪里结束。
estimatedTime: 8 分钟
journey: start
primaryAction:
  label: 选择运行方式
  href: /zh/start/choose-deployment
featuredVisual: mobazha-product-atlas
---

## 独立经营单元

Mobazha 从一个独立经营单元开始：身份、一个或多个店铺、相应政策与目录，以及拥有业务状态的后端。店面、托管应用、社群市场、社交渠道、浏览器入口或 Agent 可以展示和协助这个单元，但不会因此成为订单和资金的权威。

这是 Mobazha 的核心产品区别。它既不只是一个 Marketplace，也不只是一个自行托管商店程序，而是让独立经营的店铺在不把无限权限交给单一展示渠道的前提下参与更大的商业网络。

- [理解 Identity、店铺、Storefront 与渠道](/zh/project/identity-and-stores)
- [沿着订单、支付、履约与恢复主线理解交易](/zh/project/transaction-spine)

## 四项相互连接的产品承诺

| 承诺 | 产品含义 | 权威边界 |
|---|---|---|
| 自主 | 明确掌握店铺身份、政策、数据和运行选择 | 所选后端和运营者拥有店铺及业务状态 |
| 连接 | 通过店面、发现、社群、直接链接和集成触达买家 | 渠道可以收窄访问或展示，但不能发明后端能力 |
| 交易 | 依据可检查的状态创建、支付、履约、恢复和解决订单 | Core 拥有订单、支付验证、退款、争议、结算和审计转换 |
| 扩展 | 通过类型化契约接入支付轨道、配送服务、工具和 Agent 工作流 | 扩展只能返回受限输入，由 Core 校验受保护变更 |

这些是组织产品知识的原则，并不表示每个发行版都提供所有渠道、支付轨道、服务商或自动化能力。

## 一个 Core，多种运行路径

同一套公开契约可以通过不同运行路径使用：

- 独立运营者可以运行 Node，并选择网络暴露、集成、备份和政策。
- 托管发行版可以运营 Node 与共享基础设施，同时保持租户和店铺边界明确。
- 客户端只能展示其连接后端实际声明的有效能力。
- 发现、支付、配送、消息、AI 和托管服务仍是单独命名的可选依赖。

- [选择托管服务或自行托管](/zh/start/choose-deployment)
- [运行自己的 Mobazha Node](/zh/self-host)
- [查看英文架构与信任边界](/project/architecture)

## 交易主线

Mobazha 围绕一条交易主线变得具体：

1. 买家通过店面或分发渠道到达卖家拥有的报价。
2. 拥有订单的后端创建报价与订单身份。
3. 所选支付系统返回观察结果或服务商状态，由 Core 决定这些事实对订单意味着什么。
4. 履约、取消、退款、争议和完成遵循当前状态与适用政策。
5. 历史绑定和证据继续服务于恢复与对账。

- [在独立 Mobazha 店铺购买](/zh/buy)
- [查看英文订单状态指南](/buy/order-status)
- [查看英文退款与争议指南](/buy/cancel-refund-dispute)
- [理解订单、支付与保护状态为何必须分离](/zh/project/transaction-spine)
- [连接 Offer、Merchandising、Supply 与 Fulfillment](/zh/project/offer-to-fulfillment)

## 分发和自动化也是产品界面

社群市场、社交入口、直接链接、Marketplace 策展、消息、Webhook、MCP 和 Agent 工作流不是互不相关的附加项，而是把需求、供给和经营操作连接到独立经营单元的方式。

它们仍遵守三个限制：

- 展示界面不能覆盖交易权威；
- 配置或源码存在不代表运行时可用；
- Agent 可以准备、比较或请求动作，但执行仍受身份、权限、状态、报价与确认约束。

- [基于后端实际公开的能力进行开发](/zh/build)
- [理解社群市场与分布式发现](/zh/project/community-commerce)
- [理解 Agent、Skill、Tool 与批准边界](/zh/project/agent-commerce)
- [查看英文 MCP 与 Agent 集成](/build/mcp)
- [通过公开契约扩展 Mobazha](/zh/build/extensions)

## 分开阅读当前能力、Beta 和未来方向

本页解释产品模型。精确可用性来自当前连接的后端、版本化公开契约、发布范围和交易证据。

- [English canonical product map](/project/product-map)

| 证据 | 能证明什么 |
|---|---|
| 有效运行时能力 | 当前连接后端现在可以接纳什么 |
| 带版本的契约与发布证据 | 某个发布支持哪些接口与行为 |
| Current 政策页 | 收费、安全、兼容性或治理的公开规则 |
| Draft RFC 或路线图 | 经过评审的方向，不是已交付能力 |
| 内部设计或实施计划 | 维护者证据，不是公开产品承诺 |

- [查看英文发布范围与成熟度](/project/release-scope)
- [运行时能力与产品组合](/zh/build/runtime-capabilities)
- [查看英文公开决策与提案](/project/decisions)

> **Important:** 图、路线图、RFC、已链接的软件包或文档页面都不能激活一项能力。涉及可用性时，应以连接后端和适用发布的证据为准。
