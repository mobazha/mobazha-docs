---
title: 发布范围与成熟度
summary: 文档会区分当前候选版本行为、Preview 与未来设计。
status: Beta
audiences:
  - 所有人
evidenceLabel: Mobazha Release 与仓库文档
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/docs/releases
reviewed: 2026-07-14
translationOf: project/release-scope
pageType: policy
outcome: 区分当前 v0.3 候选版本行为、稳定保证、可选组合、提案与未来目标。
estimatedTime: 8 分钟
journey: understand
primaryAction:
  label: 查看当前发布边界
  href: /zh/project/release-scope#当前-v0-3-候选版本边界
---

## 状态词汇

- Current：已审核公开政策或稳定项目事实。
- Beta：已经可用或正在验证；兼容性与行为可能改变。
- Draft：提案或文档合约；不能当作已交付行为依赖。
- Historical：为上下文保留，并明确由其他内容取代。

## 当前 v0.3 候选版本边界

- Mobazha Node 与 Mobazha Unified 是用于评估和 Testnet 的候选版本。
- 默认开源 Node 启用 BTC、BCH 与 LTC 付款方式，但仍受 effective runtime capabilities 与卖家配置约束。
- 源码中的 identifier 或 adapter 不会启用付款方式或创造兼容承诺。
- 稳定签名 binary 与 reproducibility attestation 仍待最终发布批准。
- 无法取得有效 runtime-capability snapshot 时，client 必须 fail closed。
- 除明确维护的 translation 外，英文是仓库文档默认语言。

- [Community capability manifest](https://github.com/mobazha/mobazha/blob/main/config/editions/community.json)
- [Node v0.3.0-rc.1 notes](https://github.com/mobazha/mobazha/blob/main/docs/releases/v0.3.0-rc.1.md)
- [Unified v0.3.0-rc.1 notes](https://github.com/mobazha/mobazha-unified/blob/main/docs/releases/v0.3.0-rc.1.md)

## 依赖指南

| 问题 | 当前答案 | 需要验证 |
|---|---|---|
| 可以评估开源 Node？ | 可以，在受支持环境从已审核公开源码构建 | Commit、build prerequisites、Testnet、diagnostics 与 backup |
| 可以使用托管应用？ | 可以，作为 Beta 服务 | 条款、隐私、价格、服务状态与 deployment capabilities |
| BTC、BCH、LTC 总是可用？ | 否；它们在默认边界内，但实际可用仍有条件 | Runtime capability、seller config、dependency health、Quote 与 payment instruction |
| 每个 API/UI 都是受支持能力？ | 否 | Generated contract、runtime capability、authorization、configuration 与 release notes |
| 稳定 installer 与 unattended update 已保证？ | 否 | Signed artifact、checksum、provenance、platform validation、rollback 与 final release notice |
| Node-to-account binding 稳定？ | 否，公开合约仍为 Draft | Permission、exchanged data、revocation、test 与 version compatibility |

实质使用应要求 tagged release 与配套 evidence，不要从 `main` branch、截图、设计文档或 feature name 推断 readiness。

## Version-specific 内容

准确 checksum、artifact、known issue、migration step、SBOM、provenance 与 implementation commit 属于每个 tagged repository release。本页管理共同成熟度语言与当前公开边界，不替代 release evidence。

- [English canonical page](/project/release-scope)
