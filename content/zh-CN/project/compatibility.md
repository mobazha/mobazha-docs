---
title: 这些 Mobazha 组件能否协同工作？
summary: 连接系统或升级店铺前，检查 client、backend、contract、capability、extension、data 与 distribution 兼容性。
status: Current
audiences:
  - 卖家
  - 运营者
  - 开发者
  - Distribution 发布者
  - Agent
evidenceLabel: Node 公开合约、运行时能力、Migration 与 Conformance 来源
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-14
translationOf: project/compatibility
pageType: policy
outcome: 判断两个组件能否安全交换数据并保留业务含义，明确部署前所需证据。
estimatedTime: 9 分钟
journey: understand
primaryAction:
  label: 执行兼容性检查
  href: /zh/project/compatibility#快速兼容性检查
---

## 快速兼容性检查

连接或升级前回答七个问题：

1. **Identity：**涉及哪些准确 client、backend、package、adapter 或 distribution version？
2. **Contract：**双方声明哪一版 HTTP、event、webhook、MCP、extension 或 data contract？
3. **Capability：**连接后端是否把所需 effective capability 标为 ready？
4. **Authorization：**当前身份是否有正确 role、scope、store context 与 permission？
5. **Semantics：**双方是否同意 state transition、amount、identifier、idempotency、finality 与 recovery？
6. **Migration：**既有 data、configuration、credential 与 provider binding 能否安全升级与恢复？
7. **Evidence：**是否有 conformance、integration 或 release test 覆盖这个准确组合？

任何答案未知，即使能够编译或渲染，组合仍未经验证。

## 常见误判

- 双方认识同一字段名，不代表 authorization、状态含义、重试、确认与恢复兼容。
- 源码有 adapter，不代表 distribution 包含、运营者授权配置、依赖健康或后端展示 capability。
- 新 client 只能在其测试过的 version 与 additive behavior 范围连接旧 Node；缺少必需 schema 时必须 fail closed。
- Hosted 与 self-hosted 可共享公开合约，但 authentication、composition、capabilities、外部服务与运营责任可能不同。
- Happy path 成功不能证明 conflict、duplicate、timeout、migration、downgrade 与 recovery 安全。

## 兼容表面

| 表面 | 必须兼容 | 证据 |
|---|---|---|
| HTTP API | method、path、schema、envelope、authentication、stable error、idempotency 与 state effect | OpenAPI、negative test、release notes |
| Event 与 WebSocket | event identity、payload version、ordering assumption、reconnect 与 refresh semantics | Event contract、duplicate/reconnect test |
| Webhook | Signature、delivery identity、retry、deduplication、payload version 与 reconciliation | Webhook contract、delivery history、consumer test |
| Runtime config | Schema version、readiness、deployment profile、feature 与 capability 含义 | `/v1/runtime-config`、client resolver test |
| Commerce state | Order、payment、fulfillment、refund、dispute、settlement 与 protection | State-machine 与 transaction conformance test |
| Persisted data | Migration、provider binding、backup、restore、rollback 与 export | Migration test 与恢复后的代表性数据 |

数据库内部、private hook、composition-root 细节或 internal import 可达代码，不是公开兼容承诺。

## Version 与安全升级

Patch release 应保持支持的合约；minor release 可加入向后兼容 operation、field 或 capability；major release 可以在提供 migration guidance 后打破公开 wire、state、package 或 persisted-data contract。候选版本阶段尚未声明稳定兼容，即使看似 minor 的变化也需明确审核。

1. 记录当前 backend、client、distribution、contract、capability schema、配置与 provider version。
2. 阅读 migration、移除行为、capability change 与 known issue。
3. 创建验证过的备份并保留旧 artifact 与配置。
4. 用恢复的数据测试 store、order、payment、webhook、Agent 与 recovery。
5. 受控升级后验证 runtime readiness 与所有展示 capability。
6. 接收新工作前核对既有订单与 provider binding。
7. 只通过文档声明的数据兼容路径 rollback。

- [备份与升级](/zh/self-host/backup-and-upgrade)
- [English canonical page](/project/compatibility)
