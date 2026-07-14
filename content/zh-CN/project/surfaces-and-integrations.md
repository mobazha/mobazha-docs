---
title: 交互表面、渠道与集成契约
summary: 把 Web、移动、桌面、社群、Agent、域名、Chat、API、WebSocket、Webhook 与 MCP 放在正确层级，同时保持唯一商业权威。
status: Beta
audiences:
  - Operators
  - Developers
  - Client maintainers
  - Agent builders
  - Evaluators
evidenceLabel: Mobazha 公开前端组合、路由、HTTP、WebSocket、Webhook、MCP、Chat 与 Capability 契约
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-14
pageType: concept
outcome: 选择产品表面和集成契约，同时不把渠道、通知、域名或客户端 Shell 变成第二个状态权威。
estimatedTime: 10 分钟
journey: build
primaryAction:
  label: 查看开发者入口
  href: /zh/build
featuredVisual: surfaces-and-integrations
translationOf: project/surfaces-and-integrations
---

## 多种表面，一个商业权威

Mobazha 可以通过托管 Web 应用、自托管 Storefront、移动或桌面客户端、社群入口、嵌入式视图、Direct Link 或 Agent 使用。这些表面可以拥有不同外观与交互，同时消费相同的 Store、Catalog、Quote、Order、Payment、Fulfillment 与 Policy 契约。

稳定产品规则很简单：Surface 负责展示和请求；拥有当前 Store 或 Order 上下文的后端负责校验，并持有获准业务状态。

## 不能混在一起的五个层级

| 层级 | 示例 | 责任 |
|---|---|---|
| Experience Shell | Web、Mobile、Desktop、Embedded、Community、Browser、Agent Workspace | Navigation、Layout、本地交互、设备集成与用户解释 |
| Entry 与 Context | Domain、Storefront Slug、Marketplace、Direct Link、Tenant、Store、Role、Persona | 解析请求属于哪个商业与政策边界 |
| Interaction Contract | HTTP、WebSocket、Webhook、MCP、Chat | 用明确投递语义承载命令、读取、通知、Tool 或会话 |
| Capability 与 Authorization | Backend Version、Effective Capability、Identity、Scope、Resource State | 决定操作是否存在，以及当前 Actor 现在能否请求 |
| Commerce Authority | Core 拥有的 Quote、Order、Payment Verification、Fulfillment、Recovery 与 Audit | 接纳持久事实和受保护状态迁移 |

新客户端不需要新的订单模型；新 Transport 不会激活产品能力；新 Domain 不会授予权限；新 Notification 也不会成为交易状态。

## 渲染动作前先解析 Context

每个表面都需要足够的服务端校验上下文来回答：

1. 当前连接哪个 Deployment 和 Backend？
2. 当前 Tenant、Store、Storefront 或 Marketplace 是哪个？
3. 认证了哪个 Identity，正在以哪个 Role 或 Persona 行动？
4. 哪一份 Capability Snapshot 已就绪并具有权威？
5. 哪个 Resource State 与 Policy 控制请求动作？

Domain、Subdomain、Slug、Direct Link、社交 Start Parameter 和 Embedded Configuration 可以帮助定位 Context，但它们只是 Routing Input，不是所有权证明。服务端解析必须拒绝未知上下文，并阻止客户端提供的路由提示伪造另一个 Store 或 Storefront。

- [理解 Identity、Store、Storefront 与 Channel](/zh/project/identity-and-stores)
- [理解社群与运营者市场](/zh/project/community-commerce)
- [基于有效 Capability 构建](/zh/build/runtime-capabilities)

## 根据投递语义选择契约

| 需求 | 优先选择 | 必须具备的行为 |
|---|---|---|
| 读取当前状态或请求受保护变更 | Versioned HTTP API | 认证、校验 Schema 与 State、必要时使用 Idempotency，并返回权威结果 |
| 快速刷新交互客户端 | Authenticated WebSocket | 把 Event 当作提示，容忍丢失与未知新增类型，然后重新加载受保护状态 |
| 把事件投递给运营者控制的服务 | Signed Webhook | 持久接收、验签、去重、容忍重试与乱序，并通过 API 对账 |
| 让 Agent 发现和调用获准 Tool | MCP Streamable HTTP | 要求 `ai:use`、Tool Domain Scope、当前 Discovery、Approval Policy 与底层命令校验 |
| 交换人类或 Agent 会话 | Chat Contract，当前可由 Matrix 等已启用消息服务支撑 | 保留 Room、Message、Membership 与 Privacy；不把消息当作 Order 或 Payment 权威 |
| 协调外部商业系统 | 类型化 Extension 或 Controller Contract | 消费持久 Core Fact，并返回有边界 Observation 或 Attestation |

这些契约可以协作。Web Client 可以发送 HTTP Command 并收到 WebSocket 刷新提示；Webhook Consumer 可以响应事件后读取相关 Order；Agent 可以通过 MCP 发现 Tool，而该 Tool 调用同一个受保护 HTTP Business Operation。

## HTTP 是权威读取与命令表面

当前 Node 在 `/v1/` 下暴露带版本业务路由。OpenAPI 描述经过评审的方法、路径、Schema、Response Envelope 与认证机制。精确 Route Availability 仍取决于连接发行版、版本、Capability 与 Identity。

在 Reconnect、Notification、Chat Message、Provider Callback 或不确定 Timeout 后，应使用 HTTP 确认重要状态。客户端动画成功、Push Event 或外部 Callback 都不能替代最新权威资源。

- [查看 HTTP API 与 OpenAPI 指南](/zh/build/api)
- [查看错误、重试与幂等指南](/zh/build/errors-and-idempotency)

## WebSocket 与 Webhook 是不同事件产品

当前 `/ws` WebSocket 表面用于及时的认证客户端更新。连接可能中断，瞬时事件也可能丢失；重连后，应重新加载做出业务决定所需的资源。

Webhook 是发往运营者控制 Endpoint 的出站签名投递，面向持久接收、Retry、Delivery History 与集成工作流设计。Duplicate 和 Reordering 是预期情况。Receiver 必须校验精确签名 Body、去重 Identifier，并通过 HTTP 对账相关状态。

两个事件表面都不能按 Arrival Time 定义业务状态顺序。

- [查看 WebSocket 指南](/zh/build/websocket)
- [查看 Webhook Consumer 指南](/zh/build/webhooks)

## Chat 用于沟通，不用于结算

Chat 可以承载买卖双方问题、协商上下文、履约协调、Media、Typing State 和 Read Receipt。启用的 Matrix-backed Service 可以在公开 Chat Contract 后保存 Room、Membership、Message 与 Event Identity。

Chat Evidence 可以帮助解释争议，但消息写着“已付款”“已发货”“同意退款”或“已完成”不会执行状态迁移。受保护动作仍需通过 Order、Payment、Refund、Dispute 或 Fulfillment Contract。

不要在消息中放入 Credential、Recovery Material、完整 Payment Secret 或不必要的 Customer Data。Community Support Room 并不自动是私有交易渠道，除非其 Membership 与 Data Policy 明确如此。

## MCP 是同一边界上的机器表面

`/v1/mcp` 的 MCP 提供经过认证的 Tool Discovery 与 Invocation。它不会替代 Tool 下方的 HTTP Business Contract、Capability Response、Scope Check、Request-bound Approval 或 Core Command Gate。

MCP Client 不一定是自治 Agent；Agent Experience 也不必对每次读取都使用 MCP。应选择能保留 Identity、Schema、Risk、Confirmation 与 Audit 的最窄接口。

- [理解 Agent、Skill、Tool 与批准边界](/zh/project/agent-commerce)
- [查看 MCP 传输指南](/zh/build/mcp)

## Client Shell 与更新渠道不定义 Capability

Web、Mobile、Desktop、已安装 Launcher、面向浏览器的 Shell 或 Community Mini App 可以为不同设备与发行上下文包装同一套产品契约。每个 Shell 仍负责自己的 Navigation、Storage、Rendering、Permission、Deep Link Handling、Update Policy 与 Release Compatibility。

更新渠道可以交付较新 Client，但不能让旧 Backend 支持缺失操作。Browser Extension 或 Launcher 源码存在，也不会因为能渲染 Mobazha 数据就成为公共 Plugin Runtime。具名 Shell 与自动更新行为需要自己的签名发布、兼容性、回滚、隐私与支持证据。

> **Important:** Browser-extension Shell adoption、Universal Launcher Contract、Remote UI Plugin，以及每一种社交或 Embedded Channel 都不是当前通用公共能力。在适用 Release 明确之前，应把它们视为发行版特定能力或未来方向。

## 当前契约与演进方向

| 范围 | 当前公开含义 | 必须标注为方向的内容 |
|---|---|---|
| Experience Composition | Hosted、Standalone、Store、Marketplace 与 Embedded Concern 通过显式 Profile 和 Effective Capability 组合 | 更多经过独立验证的 Mobile、Desktop、Browser、Community 与 Sovereign Shell |
| Context Routing | 服务端解析的 Store、Storefront、Marketplace、Identity 与 Capability Context 控制体验 | 更可移植的 Domain、Deep Link 与 Channel Binding |
| HTTP | Versioned `/v1/` API 与经过评审的 OpenAPI 是权威集成表面 | 更广契约覆盖与 Conformance Evidence |
| WebSocket | Authenticated `/ws` Event 支持实时刷新与重连对账 | 更完整的 Versioned Event Contract |
| Webhooks | Signed CloudEvents-style Delivery 支持可重试运营集成 | 更多 Event Coverage、Tooling 与 Managed Consumer |
| Chat | Capability-gated Chat 与 Matrix-backed Messaging Contract 可以承载 Room、Message、Media 与 Live Event | 更丰富的跨客户端会话、Moderation 与 Commerce Context |
| MCP | Authenticated `/v1/mcp` 只暴露获准 Tool Operation | 在不削弱 Command Gate 的前提下扩展 Client 与 Tool Coverage |

连接后端的 Route、Effective Capability、Authentication Result、适用 Release 与当前 Resource State 仍是权威。文档和客户端包装只能解释 Surface，不能激活它。

- [English canonical surfaces-and-integrations page](/project/surfaces-and-integrations)
