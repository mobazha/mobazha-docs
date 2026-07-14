---
title: Mobazha 组件能否一起工作
summary: 在连接系统或升级店铺前，检查客户端、后端、契约、能力、扩展、数据与分发版本的兼容性。
status: Current
audiences:
  - 卖家
  - 运营者
  - 开发者
  - 分发者
  - Agent
evidenceLabel: Node 公开契约、运行时能力、迁移与一致性来源
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-14
translationOf: project/compatibility
pageType: policy
outcome: 判断两个 Mobazha 组件能否安全交换数据并保留业务含义，并确定部署前所需证据。
estimatedTime: 9 分钟
journey: understand
primaryAction:
  label: 执行兼容性检查
  href: /zh/project/compatibility#快速兼容性检查
---

## 本页的位置

兼容性比产品架构更具体，但不只是“请求返回了 JSON”。不同问题应使用不同来源：

| 问题 | 来源 |
|---|---|
| 哪个系统拥有请求或状态？ | [系统架构](/zh/project/architecture) |
| 连接的后端现在能做什么？ | [运行时能力](/zh/build/runtime-capabilities) |
| 哪个 HTTP operation 或 Schema 存在？ | [API 与 OpenAPI](/zh/build/api) |
| 功能是否属于当前发布？ | [发布范围](/zh/project/release-scope) |
| 这些版本和组件能否安全协作？ | 本页及适用发布证据 |

## 直接回答

- **客户端与后端都识别同名字段，是否代表兼容？** 不一定。授权、状态含义、幂等、确认、恢复和失败行为也是契约的一部分。
- **源码里存在 Adapter，客户端能否使用？** 只有分发版本包含它、契约版本匹配、运营者已授权和配置、依赖健康，且后端声明有效能力时才可以。
- **新客户端能否连接旧 Node？** 仅限客户端已经测试的版本和增量行为。缺少必需 Schema 或能力信息时必须 fail closed。
- **托管和自行托管店铺能否使用相同客户端与集成？** 可以共享公开契约，但认证、部署组成、启用能力、外部服务和运营责任可能不同。
- **成功的 happy path 是否证明兼容？** 不能。还必须覆盖冲突、重试、重复事件、超时、旧数据、迁移、降级和恢复路径。

## 快速兼容性检查

连接或升级两个组件前，回答以下七个问题：

1. **身份：** 涉及哪些精确客户端、后端、Package、Adapter 或分发版本？
2. **契约：** 双方共同声明哪个生成的 HTTP、事件、Webhook、MCP、扩展或数据契约？
3. **能力：** 连接后端是否把所需有效能力声明为 ready？
4. **授权：** 当前身份是否拥有所需 Role、Scope、Store Context 和 Permission？
5. **语义：** 双方是否对状态转换、金额、标识符、幂等、最终性和恢复达成一致？
6. **迁移：** 现有数据、配置、凭据和服务商绑定能否安全升级和恢复？
7. **证据：** 是否有覆盖这个精确组合的一致性、集成或发布测试？

只要有一项未知，即使代码能编译或页面能显示，该组合仍未得到验证。

## 兼容性表面

| 表面 | 必须保持兼容的内容 | 应检查的证据 |
|---|---|---|
| HTTP API | Method、Path、Schema、Envelope、认证、稳定错误、幂等和状态影响 | 生成的 OpenAPI、负向测试、发布说明 |
| Event 与 WebSocket | Event identity、Payload version、排序假设、重连行为和刷新语义 | 事件契约、重复与重连测试 |
| Webhook | 签名、投递标识、重试、去重、Payload version 和对账 | Webhook 契约、投递历史、消费者测试 |
| Runtime configuration | Schema version、Readiness、Deployment profile、Feature 与 Capability 含义 | `/v1/runtime-config`、客户端 resolver 测试 |
| 交易状态 | Order、Payment、Fulfillment、Refund、Dispute、Settlement 和 Protection 含义 | 状态机与交易一致性测试 |
| 标识符 | 权威 Asset、Chain、Payment、Store、Order 和 Capability identity | 公开标识符契约与 normalization 测试 |
| 扩展与 Package | 受支持的公开 Port、Module、Function、Controller 或进程外协议 | 版本化 Package 契约和组合测试 |
| 持久数据 | Schema migration、服务商绑定、备份、恢复、回滚和导出 | 迁移测试、恢复后的代表性数据 |

数据库内部结构、具体 Constructor、私有 Hook、Composition Root 细节，以及可通过内部 Import 访问的代码，都不是公开兼容性承诺。

## 常见场景

### 新客户端连接旧后端

客户端应先读取 Runtime Schema 和 Capability Readiness。可以容忍增量未知字段，但不能把缺少的必需状态、畸形能力或不兼容 Schema 转换成“默认支持”。可选 UI 应保持不可用，而不是调用猜测出来的 Route。

### 集成识别了一个付款标识符

识别只证明标识符可解析或显示，并不证明分发版本包含 Adapter、卖家已启用、凭据存在、依赖健康，或当前 Order Mode 支持它。

### 服务商被禁用，但旧订单仍存在

新工作可以停止接纳，但已有订单会保留服务商绑定，仍可能需要观察、退款、结算或对账。兼容性包括履行这些历史义务的能力；悄悄选择另一服务商不是安全 fallback。

### 托管与自行托管共享 API

Operation 形状可能相同，但认证、多店铺路由、限制、托管依赖和有效能力可能不同。集成必须发现上下文和能力，不能只按产品名称分支。

### 托管与自行托管店铺共享网络

共享发现、签名内容、消息或交易协议不会创建共享订单数据库。先解析选中的店铺和后端，再向该后端对账状态。Hosting gateway 可以路由托管店铺上下文，但不会因此成为独立 Node 的兼容代理或恢复权威。

Hybrid 兼容需要两层证据：Peer 或服务协议能够互操作，而且选中后端仍接受所需业务能力、身份和状态转换。

## 版本与变更规则

- Patch release 应在修复缺陷和安全问题时保留受支持契约。
- Minor release 可以增加向后兼容的 Operation、Field、Event、Capability 或 Extension point。
- Major release 可以有意破坏受支持的 Wire、State、Package 或 Persisted-data contract，但必须提供迁移指导。
- RC 开发期间，即使看似很小的变更也需要明确审阅，因为稳定兼容性尚未声明。

改变状态含义、把可选服务改成强制、删除字段、削弱资金不变量或改变重试安全性，即使传输仍可解析，也属于 breaking change。

Breaking change 需要公开决策证据、迁移与降级指导、更新一致性测试、支持窗口、发布说明和文档影响审阅。

## 安全升级流程

1. 记录运行中的后端、客户端、分发版本、契约、Capability Schema、配置和服务商版本。
2. 阅读发布说明中的迁移、移除行为、能力变更和已知问题。
3. 创建已验证备份，并保留上一个可运行制品和配置。
4. 使用恢复数据测试代表性的店铺、订单、付款、Webhook、Agent 和恢复流程。
5. 在受控环境升级，然后验证 Runtime Readiness 以及部署声明的每项能力。
6. 接纳新工作前，对账现有订单和服务商绑定。
7. 只沿文档说明的数据兼容路径回滚；旧 Binary 可能无法理解迁移后的数据。

- [安全备份和升级](/zh/self-host/backup-and-upgrade)
- [处理错误、重试和幂等](/zh/build/errors-and-idempotency)

## 什么能证明兼容

最强证据是使用代表性数据，对精确发布组合执行测试：

- 生成契约验证；
- Unit 与 State-machine invariant；
- Standalone 与托管分发集成测试；
- 共享 Black-box conformance test；
- 迁移、备份、恢复和降级演练；
- 重复、超时、冲突、依赖失败与恢复测试。

Mock 有助于开发，但不能证明生产分发、外部服务商或历史数据集兼容。记录精确版本，并把证据与发布或部署决定保存在一起。

- [English canonical page](/project/compatibility)
