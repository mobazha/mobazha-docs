---
title: Mobazha 系统与店铺网络如何协作
summary: 比较 Direct P2P 和 Hybrid 店铺网络，并把请求追踪到拥有店铺与交易状态的后端。
status: Beta
audiences:
  - 买家
  - 卖家
  - 运营者
  - 开发者
  - 评估者
  - Agent
evidenceLabel: Mobazha 公开产品、Node、运行时与分发契约
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-14
translationOf: project/architecture
pageType: concept
outcome: 区分 Direct P2P 与 Hybrid 店铺网络，识别每个决定的拥有后端，并追踪不同界面和服务之间的权威。
estimatedTime: 10 分钟
journey: understand
primaryAction:
  label: 比较两种拓扑
  href: /zh/project/architecture#阅读拓扑
featuredVisual: store-network-topologies
---

## 阅读拓扑

Mobazha 是 Peer-to-peer，因为独立运营的店铺后端可以参与共享发现、签名内容、消息和交易协议，而无需把所有店铺或订单移入一个中心平台数据库。这**不表示**每个买家都要运行 Node、每个请求都必须在传输层直连，也不表示每个 Peer 都会收到所有订单副本。

两种拓扑都以选中的卖家后端作为稳定权威边界：

| 问题 | Direct P2P 店铺网络 | Hybrid 店铺网络 |
|---|---|---|
| 店铺运行在哪里？ | 独立店铺自行运营的 Node | 独立 Node 或托管 Commercial Node |
| 买家如何访问？ | Storefront、App、Direct link 或 Agent 解析卖家 Node 并请求动作 | 入口解析卖家上下文；Hosting gateway 路由托管上下文，独立上下文继续访问自己的 Node |
| 哪些内容可以跨网络？ | 已发布 Profile 和 Offer、发现信号、消息及明确协议请求 | 相同公开协议关系，加上单独启用的托管、索引、付款、配送、消息或自动化服务 |
| 哪些内容不会自动扩散？ | 私有店铺数据、恢复材料、凭据和权威订单记录 | 独立 Node 数据和订单不会因为使用托管渠道或可选服务就移入 Hosting |
| 谁决定订单是否改变状态？ | 创建并拥有订单的选中卖家后端 | 选中的卖家后端，无论独立还是托管；不是入口渠道、Gateway、Index 或其他 Peer |

**Direct P2P** 指独立 Node 作为 Peer，而不是共享数据库。**Hybrid** 指共存和有边界的服务组合，不是第三种订单所有者。一笔订单仍只有一个活跃后端上下文。

- [选择托管或自行托管](/zh/start/choose-deployment)
- [理解社群市场与分布式发现](/zh/project/community-commerce)
- [检查连接后端能做什么](/zh/build/runtime-capabilities)

## 使用正确的架构视图

拓扑不会把所有 Actor、Client、Chain、Contract 和 Node component 放在同一张图上，因为它们属于不同架构维度。混在一起会让可选集成看似强制，或让共享服务看似权威。

| 视图 | 应回答的问题 | 使用来源 |
|---|---|---|
| 店铺网络拓扑 | 独立与托管店铺如何共存？哪个后端拥有订单？ | 上述拓扑和本页 |
| 交易与保护流程 | 买家、卖家、付款证据、履约、退款、争议和仲裁责任如何交互？ | [订单、付款与恢复](/zh/project/transaction-spine)和[取消、退款或争议](/zh/buy/cancel-refund-dispute) |
| 体验与渠道拓扑 | Web、Desktop、Mobile、Community、Embedded、Messaging 和 Agent 入口如何访问同一交易上下文？ | [交互表面与集成](/zh/project/surfaces-and-integrations) |
| Node 组成 | Core service、本地数据、内容存储、消息、钱包和服务商 Adapter 如何组成一个后端？ | 下述六部分模型、[自行托管](/zh/self-host)及公开实现契约 |
| 付款与结算拓扑 | 一笔订单适用哪个 Rail、Wallet、Provider、Chain、Escrow 或 Settlement controller？ | [卖家付款](/zh/sell/payments)、订单绑定 Payment Session、运行时能力和适用服务商契约 |

只有当前能力和政策证据支持时，具体 Blockchain、Smart contract、Social client、Hosted service 或 Arbitration mechanism 才应出现在更具体的视图中。概念图中出现不表示普遍可用。

## 本页的位置

Mobazha 可以表现为 Storefront、Hosted application、Self-hosted Node、Community market、Direct link、API 或 Agent workflow。它们不是相互独立的产品解释，而是围绕同一交易模型的界面和运营路径。

| 页面 | 回答的问题 |
|---|---|
| [产品地图](/zh/project/product-map) | Mobazha 的主要产品概念和使用方式是什么？ |
| **本架构页** | 哪些系统处理请求、状态位于哪里、哪个系统是权威？ |
| [交易主线](/zh/project/transaction-spine) | 订单如何经过付款、履约、完成和恢复？ |
| [运行时能力](/zh/build/runtime-capabilities) | 当前连接后端现在能做什么？ |
| [发布范围](/zh/project/release-scope) | 哪些能力有当前发布证据、受条件限制或仍是 Draft？ |

如果只需要购买或销售，跟随任务指南即可。需要理解两个界面为何不一致、选择运营模式、集成服务或确定故障责任时再使用本页。

## 系统的六个部分

| 部分 | 用户看到或依赖什么 | 它可以决定什么 |
|---|---|---|
| Presentation surface | Storefront、Admin、托管 App、Web 或 Desktop client、Direct link、Community entry、Agent、API client | 信息如何展示，以及请求哪个受支持动作 |
| Selected backend | 服务当前 Store 和 Order context 的托管或自行托管 Node | 店铺数据、身份上下文、有效能力、授权和准入业务操作 |
| Open Core | 后端中的订单、付款验证、退款、争议、结算、保护和审计状态机 | 受保护转换是否有效，以及下一个权威状态 |
| Adapter 与 Controller | 付款、配送、消息、搜索、Webhook 和其他有边界集成 | 转换请求、观察和服务商结果，但不能直接创造 Core 状态 |
| External system | Blockchain、Wallet、Payment provider、Carrier、Messaging network、Indexer、AI provider 或其他明确服务 | 自己边界内的事实与动作 |
| Public knowledge 与发布证据 | Canonical docs、生成契约、Capability response、一致性测试和 Tagged release | 公开政策的含义以及特定发布可以声明什么 |

长期规则很简单：界面可以请求动作，外部服务商可以报告事实，但拥有订单的后端决定这些输入是否形成有效业务状态变化。

## 一条请求如何经过系统

以买家打开 Offer 并付款为例：

1. **界面解析上下文。** Storefront、Application 或 Agent 确定正在操作的 Store 和 Backend。
2. **客户端发现可用性。** 读取 Runtime configuration 和 Effective capability，而不是假设所有 Mobazha 部署相同。
3. **后端创建业务记录。** 创建订单前验证 Identity、Store policy、Listing revision、Quote、Authorization 和当前状态。
4. **Core 绑定交易。** 订单获得持久 Identity 与已接受条款快照；Payment Session 绑定预期 Rail、Amount、Funding target 或 Provider state、Expiry 和 Verification rule。
5. **外部系统报告证据。** Chain observer、Wallet、Payment provider、Webhook 或运营者报告观察结果。报告是证据，不是跳过状态机的许可。
6. **Core 接受或拒绝转换。** 在推进付款或订单状态前核对预期 Order、Amount、Asset、Confirmation、Identity、Policy 和 Idempotency。
7. **界面刷新权威状态。** 买家、卖家、Webhook consumer 和 Agent 根据最新后端状态显示或行动，而不是仅根据通知。

配送、自提、取消、退款、争议和结算都遵循同一结构：集成提供有边界的输入，拥有后端验证受保护变化。

## 托管、自行托管与可选服务

| 运营路径 | 谁运行后端？ | 谁负责运维？ | 哪些内容仍独立？ |
|---|---|---|---|
| 托管 | 托管服务运行适用商业分发并路由当前账号或店铺上下文 | 服务运营者按条款管理部署和可用性；店铺运营者仍负责 Catalog、Policy 和订单责任 | Payment rail、Delivery、AI、Messaging 和其他服务仍是明确依赖 |
| 自行托管 | 卖家或独立运营者运行已发布 Node distribution | 运营者负责主机安全、数据、备份、网络暴露、更新、监控与恢复 | 可选 Mobazha 或第三方服务单独启用，并披露交换数据和价格 |
| Hybrid | 自托管或托管后端调用选中的外部能力 | 责任按公开服务与交易契约分开 | 连接服务不会自动转移订单权威或本地恢复材料 |

托管和自行托管可以共享公开契约与 Core 行为，但不是同一 Distribution 或运营边界。买家不必理解仓库拓扑，运营者必须知道哪个后端拥有店铺以及谁为每项依赖负责。

- [选择托管或自行托管](/zh/start/choose-deployment)
- [运行和恢复自行托管 Node](/zh/self-host)
- [查看分发与打包政策](/zh/project/distribution)

## 在哪里找权威答案

| 用户问题 | 首先检查的权威 |
|---|---|
| 当前订单状态是什么？ | 拥有订单的后端 |
| 应向哪里付款，已经验证了什么？ | 订单绑定 Payment Session 与后端付款记录 |
| 此处是否提供该功能？ | 连接后端 ready 的运行时能力响应 |
| 此人或 Agent 能否执行动作？ | 后端 Authorization、Role、Scope、Store context 和当前状态 |
| 是否发生付款、配送或服务商事件？ | 适用服务商证据，以及对其进行对账的后端记录 |
| 支持哪个精确请求和响应形状？ | 生成契约和 Tagged release evidence |
| 公开收费、安全或兼容规则是什么？ | docs.mobazha.org 上的 canonical policy |
| 此订单适用什么金额和收款方？ | 公开政策范围内的已接受 Quote 与交易记录 |

文档用于解释这些权威，不能启用能力、改变订单或替代交易证据。

## 权威与恢复边界

Mobazha 把不同状态的权威留给各自负责的系统，避免互相竞争的事实来源。Presentation surface 可以请求动作，External provider 可以报告证据，但都不能悄悄取代拥有 Store 或 Order 的 Backend。

- **Store 与 Order state 由 Backend 拥有。** Cache page、Notification、Community channel、Gateway 或 Agent 不能独立推进受保护交易。
- **Provider evidence 需要对账。** Payment、Delivery、Messaging 等观察要根据预期 Order、Policy 和当前 State 核对，不能直接假定写入 Core。
- **可选服务仍是有边界依赖。** 不可用可以缩小工作流，但不会转移订单权威或改变恢复责任。
- **受保护动作需要当前证据。** 只有拥有后端确认适用 Capability、Permission 和 State transition 后，客户端才能把付款、发货、退款、争议或结算显示为完成。

这能防止延迟渠道或依赖响应成为未经验证的业务状态变化。执行任务时继续使用对应指南：

- 买家可以[跟踪付款和订单状态](/zh/buy/order-status)，或[选择取消、退款或争议路径](/zh/buy/cancel-refund-dispute)。
- 卖家可以[验证付款准备与恢复](/zh/sell/payments)。
- 运营者和集成者可以[检查有效运行时能力](/zh/build/runtime-capabilities)、查看[交互表面与集成](/zh/project/surfaces-and-integrations)，或[报告可复现问题](/zh/support)。

## 扩展不能绕过 Core

Mobazha 使用 Typed port、Module、Deterministic policy function 和 Controller 组合集成。具体机制取决于工作，但权威限制一致：

- 扩展只接收完成工作所需的最少数据和能力；
- 源码存在或识别标识符不等于能力已激活；
- Controller 可以观察或请求工作，但不能直接写入受保护 Order 或 Payment state；
- 所有资金或订单变化都必须通过经过授权的 Core command；
- Client 与 Distribution 可以缩小声明行为，但不能扩大 Backend capability。

- [基于公开扩展契约构建](/zh/build/extensions)
- [使用 API、WebSocket、Webhook 与 MCP](/zh/project/surfaces-and-integrations)

## 当前边界与演进

当前公开行为由连接后端、生成契约、有效能力和发布证据共同确定。v0.3 仍是候选版本，因此精确组合和启用集成都带条件。

Draft RFC 正在探索更多可复用 Core service 和 Frontend composition。通用 Dynamic plugin、Remote UI code、Universal product manifest 和不受限制的 Runtime extension 都不是当前公开契约。架构方向必须与用户今天可以运行的软件分开标记。

- [检查当前发布成熟度](/zh/project/release-scope)
- [阅读兼容与一致性政策](/zh/project/compatibility)
- [查看公开 RFC 与 ADR](/zh/project/decisions)
- [English canonical page](/project/architecture)
