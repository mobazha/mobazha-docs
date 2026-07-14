---
title: Agent、Skill、Tool 与批准边界
summary: 理解 Mobazha 如何把 Agent 建议转化为有 Scope、可复核的商业动作，而不把模型、Prompt 或 Skill 当成权威。
status: Beta
audiences:
  - Sellers
  - Operators
  - Agent builders
  - Developers
  - Security reviewers
evidenceLabel: Mobazha 公开 Agent Kernel、MCP、Identity、Scope、Capability 与扩展契约
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-14
pageType: concept
outcome: 把 Agent、Skill、Tool、MCP 传输、批准与 Core 命令放在正确的权威边界。
estimatedTime: 10 分钟
journey: understand
primaryAction:
  label: 查看 MCP 指南
  href: /zh/build/mcp
featuredVisual: agent-commerce-boundary
translationOf: project/agent-commerce
---

## 辅助与权威是两种不同产品能力

Agent 可以帮助买家比较商品、帮助卖家准备 Listing、总结订单，或建议下一步运营动作。这些能力都不会让 Agent 自动获得 Identity、资金、政策或商业状态的权威。

Mobazha 把推理与执行分开。模型或 Skill 可以提出意图；类型化 Tool 把获准意图转化为有边界的请求；经过认证的后端再次评估 Scope、Capability、状态、报价、政策、批准和幂等性，然后才接纳受保护命令。

## 六个不同概念

| 概念 | 责任 | 它不会自动授予什么 |
|---|---|---|
| Agent | 维护任务会话、收集上下文、推理并呈现选择 | 店铺访问、消费权限或修改订单的授权 |
| Skill | 围绕抽象能力包装指令与可复用业务工作流 | 数据库、钱包、密钥或状态机直接访问 |
| Tool | 定义一个类型化可执行操作，包括输入输出、风险、副作用与能力要求 | 因为某处知道或列出了这个 Tool 就自动获得权限 |
| MCP 或 API 传输 | 通过认证接口承载发现与调用 | 绕过网关 Identity 或领域 Scope 的通道 |
| Approval | 记录人类针对具体提议请求作出的决定 | 对不同 Payload、过期报价、已变化状态或无限重试的授权 |
| Core Command Gate | 校验请求并拥有获准的业务状态迁移 | 在没有独立检查时直接信任模型输出 |

- [使用机器可读文档界面](/zh/agents)
- [查看认证与 Scope 指南](/zh/build/authentication)
- [理解类型化扩展边界](/zh/build/extensions)

## 安全执行路径

1. **解析上下文。** 确认 Tenant、Store、Thread、Actor、持有角色，以及本次任务唯一的 Acting Persona。
2. **选择 Skill。** 只加载适用于当前 Persona、任务、发行版和有效 Capability 的 Skill。
3. **发现 Tool。** 从当前 Tool Catalog 解析具体 Tool，不凭 Prompt 记忆编造 Tool 名称。
4. **准备请求。** 校验 Schema，说明副作用，展示收款方和金额，并在需要时分配稳定幂等键。
5. **请求批准。** 对写入、金融或危险动作，把用户决定绑定到精确动作与请求 Hash。
6. **重新校验并执行。** 后端再次检查 Identity、Scope、Capability、预期状态、报价、政策、批准与新鲜度。
7. **记录结果。** 保留请求、批准、命令、订单与结果标识，同时脱敏 Credential 与个人数据。

这条路径有意比“模型调用了一个函数”更严格。同一个 Tool 请求可能对一个 Actor 和 Store 合法，对另一个则被拒绝，也可能在执行前已经失效。

## Persona、Scope 与 Capability 解决不同问题

- **Persona** 表明用户在本轮以买家、卖家、Moderator 或 Operator 中的哪个角色行动。持有多个角色不应让所有角色的 Skill 和 Tool 泄漏进同一个任务。
- **Scope** 表明 Credential 可以请求哪些领域动作，例如读取 Listing、管理订单、读取钱包或写入 Chat。
- **Capability** 表明当前连接的发行版和后端现在能否接纳该产品动作。
- **资源状态与政策** 表明该动作对这一个订单、Listing、支付会话或 Thread 是否有效。

四者可能都必须满足。`ai:use` 可以准入 MCP 会话，但单个 Tool 仍需要自己的领域 Scope 和底层资源检查。

## Skill 是工作流，不是秘密超能力

Skill 应明确业务结果、所需抽象能力、输入、预期 Artifact、审核点和失败条件。即使具体 Tool 实现变化，Skill 仍应保持稳定。

不同发行版可以采用不同 Skill 交付方式：

- 本地或嵌入式纯文本 Skill 可以引导自托管工作流；
- 经审核的第一方 Skill 可以组合受信任 Tool；
- 托管商业 Skill 可以提供私有策略、模型路由或数据服务；
- 未来远程或加密 Skill 交付必须在具备运行时与安全证据之前保持明确标注。

源码存在、Skill 标识存在或发现一个 Prompt 文件，都不能证明连接后端已经授权、启用或安全支持该工作流。

## Approval 把意图绑定到单次动作

受保护动作需要的不只是笼统的“同意”。审核界面应显示当前 Store 与 Persona、动作、受影响资源、收款方、金额或价格影响、政策后果和可逆性；持久 Approval 应绑定请求 Payload 并拥有稳定标识。

以下情况下执行仍必须失败关闭：

- 批准后订单或资源状态发生变化；
- 报价、收款目标或截止时间过期；
- 认证 Actor 或当前 Store 已不匹配；
- Tool Schema、Capability 或政策发生变化；
- 幂等与重放规则不允许再次尝试。

Approval 让提议动作可以复核，不会把 Core 权威移动到 Agent Runtime。

## MCP 是一种执行界面，不是 Agent 产品本身

当前 Node MCP 入口在 `/v1/mcp` 使用经过认证的 Streamable HTTP。它是发现和调用获准 Tool 的机器界面。面向人的 Workspace、嵌入式 Assistant、计划任务、Webhook 和直接 API Client 可以使用相同底层业务契约，而不因此成为 MCP。

反过来，MCP 连接也不自动等于自治 Agent。自治还需要显式任务、Credential 生命周期、Scope、Tool Policy、预算、确认政策、失败处理和审计责任人。

- [查看 MCP 传输指南](/zh/build/mcp)
- [查看冲突与幂等指南](/zh/build/errors-and-idempotency)
- [沿着交易主线理解权威](/zh/project/transaction-spine)

## 当前契约与演进方向

| 范围 | 当前公开含义 | 必须标注为方向的内容 |
|---|---|---|
| MCP | 经过认证的 `/v1/mcp` 发现与调用还受 `ai:use` 和 Tool 领域 Scope 约束 | 更多客户端、更丰富 Tool 覆盖与跨界面编排 |
| Agent Kernel | Context Scope、Persona、Tool Metadata、Risk、Approval、Run、Memory 与 Provider 接口定义可复用边界 | 更广泛生产工作流、Policy Pack 与运营体验 |
| Skills | 纯文本和 Provider 加载的 Skill 契约可以描述可复用工作流 | 商业 Registry、许可交付与第三方 Skill 生态 |
| Approval | 请求绑定的批准和幂等原语支持 Human-in-the-loop 写入 | 更丰富风险政策、身份升级、撤销与多方批准 |
| 商业自动化 | Agent 可以在当前契约允许范围内读取、起草、比较、总结、准备并请求动作 | 通过证据门槛后的更多卖家、买家、客服与运营者工作流 |

不要因为 Kernel 存在就推断所有 Skill、Tool、模型提供商、Memory 系统、商业工作流或自治模式已经可用。连接后端的 Tool Catalog、有效 Capability、适用政策与发布证据仍是权威。

- [English canonical Agent-commerce page](/project/agent-commerce)
