---
title: Mobazha 系统与店铺网络如何组合
summary: 比较直接 P2P 与混合店铺网络，并沿请求找到拥有店铺和交易状态的后端。
status: Beta
audiences:
  - 买家
  - 卖家
  - 运营者
  - 开发者
  - 评估者
  - Agent
evidenceLabel: Mobazha 公开产品、Node、运行时与 Distribution 合约
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-14
translationOf: project/architecture
pageType: concept
outcome: 区分直接 P2P 与混合店铺网络，找出每项决定的后端 owner，并追踪不同表面与服务间的权威。
estimatedTime: 10 分钟
journey: understand
primaryAction:
  label: 比较两种拓扑
  href: /zh/project/architecture#阅读拓扑
featuredVisual: store-network-topologies
---

## 阅读拓扑

Mobazha 的 P2P 含义是：独立运营的店铺后端可以参与共享发现、签名内容、消息与商业协议，而不必把每个店铺和订单都迁入一个中央平台数据库。它不表示每个买家都必须运行 Node、每个请求都在 transport 层直连，或每个 peer 都持有所有订单副本。

两种拓扑中，所选卖家后端都是稳定权威边界：

| 问题 | 直接 P2P 店铺网络 | 混合店铺网络 |
|---|---|---|
| 店铺在哪里运行？ | 由独立店铺运营的 Node | 独立 Node 或托管 Commercial Node |
| 买家如何到达？ | Storefront、app、direct link 或 Agent 解析卖家 Node 并请求操作 | 入口解析卖家上下文；Hosting gateway 路由托管上下文，独立上下文继续到自己的 Node |
| 哪些内容可跨网络？ | 公开 profile、Offer、发现信号、消息与明确 protocol request | 相同公开关系，加上分别启用的 hosted、index、payment、delivery、messaging 或 automation service |
| 哪些不会自动扩散？ | 私有店铺数据、恢复材料、凭据与权威订单记录 | 独立 Node 使用托管渠道或可选服务，不会因此把数据与订单迁入 Hosting |
| 谁决定订单状态变化？ | 创建并拥有订单的卖家后端 | 所选卖家后端；不是入口渠道、gateway、index 或其他 peer |

**Direct P2P** 指独立 Node 互为 peer，而不是共享一个数据库；**Hybrid** 指共存与有边界的服务组合，不产生第三种订单 owner。

## 选择正确的架构视图

| 视图 | 回答的问题 | 来源 |
|---|---|---|
| 店铺网络拓扑 | 独立与托管店铺如何共存，谁拥有订单？ | 本页 |
| 交易与保障 | 付款、履约、退款、争议如何协作？ | [交易主线](/zh/project/transaction-spine)与[取消、退款或争议](/zh/buy/cancel-refund-dispute) |
| 体验与渠道 | Web、桌面、移动、社群、消息和 Agent 如何到达同一商业上下文？ | [交互表面与集成](/zh/project/surfaces-and-integrations) |
| Node composition | Core、数据、内容、消息、钱包和 adapter 如何组成后端？ | 本页六部分模型与[自行托管](/zh/self-host) |
| 付款与结算 | 某订单适用哪个 rail、wallet、provider、chain 或 escrow？ | [卖家付款](/zh/sell/payments)、订单 Payment Session 与运行时能力 |

具名 blockchain、smart contract、social client 或托管服务只有在当前 capability 与政策证据支持时才进入更具体视图；概念图中出现不代表普遍可用。

## 系统的六个部分

| 部分 | 用户看到或依赖什么 | 可以决定什么 |
|---|---|---|
| Presentation surface | Storefront、Admin、hosted app、client、direct link、community、Agent 或 API client | 展示方式与请求哪个受支持操作 |
| Selected backend | 服务当前店铺与订单上下文的 hosted 或 self-hosted Node | 店铺数据、身份上下文、effective capabilities、授权与获准业务操作 |
| Open Core | 订单、付款验证、退款、争议、结算、保障与审计状态机 | 受保护转换是否有效，以及下一个权威状态 |
| Adapter 与 controller | Payment、delivery、messaging、search、webhook 等集成 | 转换请求和 observation；不能直接创造 Core state |
| External system | Chain、wallet、provider、carrier、messaging、indexer 或 AI provider | 自身边界内的事实与操作 |
| Public knowledge 与 release evidence | Canonical docs、生成合约、capability response、conformance test 与 tagged release | 公开政策含义与某版本可以声称的内容 |

规则很简单：表面可以请求操作，外部 provider 可以报告事实；只有拥有订单的后端决定输入是否形成有效业务状态变化。

## 一个请求如何经过系统

1. 表面解析目标店铺与后端上下文。
2. Client 读取 runtime configuration 与 effective capabilities，而不是假定所有 deployment 相同。
3. 后端检查身份、政策、Listing revision、Quote、authorization 与当前状态后创建业务记录。
4. Core 为订单建立 durable identity，并用 Payment Session 绑定 rail、金额、funding target 或 provider state、expiry 与 verification rule。
5. 外部系统报告 evidence；evidence 不是跳过状态机的权限。
6. Core 检查预期订单、金额、资产、confirmations、身份、政策与 idempotency 后接受或拒绝转换。
7. Buyer、seller、webhook consumer 与 Agent 从最新后端状态刷新，而不是只看 notification。

Shipping、pickup、cancel、refund、dispute 与 settlement 都遵循同一结构：集成提供有边界输入，拥有后端验证受保护变更。

## 托管、自行托管与可选服务

| 路径 | 谁运行后端？ | 谁负责运营？ | 保持分离的内容 |
|---|---|---|---|
| Hosted | 托管服务运行相应 commercial distribution | 服务商按其条款负责 deployment；店铺运营者仍负责 catalog、政策与订单义务 | Payment rail、delivery、AI、messaging 等仍是具名依赖 |
| Self-hosted | 卖家或独立运营者运行已发布 Node distribution | 运营者负责主机安全、数据、备份、网络、更新、监控与恢复 | 可选 Mobazha 或第三方服务分别启用，并披露数据与价格 |
| Hybrid | Hosted 或 self-hosted backend 调用选定外部能力 | 责任按服务与交易合约拆分 | 连接服务不会自动转移订单权威或本地恢复材料 |

## 查找权威答案

| 问题 | 首先检查 |
|---|---|
| 当前订单状态？ | 拥有订单的后端 |
| 应付哪里、已验证什么？ | 订单绑定 Payment Session 与后端付款记录 |
| 此处是否可用？ | 连接后端 ready 的 runtime capability |
| 人或 Agent 能否操作？ | Backend authorization、role、scope、store context 与当前 state |
| 精确 request/response？ | Generated contract 与 tagged release evidence |
| 公开收费、安全或兼容规则？ | docs.mobazha.org 的 canonical policy page |
| 本订单金额与收款方？ | 公开政策范围内的 accepted Quote 与 transaction record |

Extension 只能接收最少数据与 capability；controller 不能直接写受保护订单或付款状态，所有财务或订单变更都要返回授权 Core command。

当前 v0.3 仍是候选版本。Dynamic plugin、remote UI code、universal product manifest 与无限制 runtime extension 不是当前公开合约。

- [发布范围](/zh/project/release-scope)
- [兼容性](/zh/project/compatibility)
- [English canonical page](/project/architecture)
