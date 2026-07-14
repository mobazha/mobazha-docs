---
title: Releases
summary: 使用仓库 Release 查找准确版本、Migration note、checksum 与 known issue。
status: Current
audiences:
  - 运营者
  - 开发者
evidenceLabel: Mobazha GitHub Releases
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/docs/releases
reviewed: 2026-07-14
translationOf: releases
pageType: hub
outcome: 找到当前 release evidence 与采用检查，不把 release candidate 当作稳定生产软件。
estimatedTime: 5 分钟
journey: understand
primaryAction:
  label: 查看当前候选版本
  href: /zh/releases#当前候选版本
---

## 当前候选版本

v0.3 用于评估与 Testnet。稳定 binary 与签名 release artifact 尚未发布。首个 release 默认启用 BTC、BCH 与 LTC，但受完整 effective-capability 交集和卖家配置约束。

## 采用 Release 前

- 确认 repository、version、publication date 与 artifact integrity。
- 阅读 breaking change、migration、capability change 与 known issue。
- 在代表生产的环境测试 backup 与 rollback。

## 文档 Release Gate

Node 与 Unified tag workflow 会验证 versioned release note 存在、必要公开指南可访问，且文档 source manifest 审核的正是将打 tag 的 commit。Tag 不得在公开指南仍描述另一 source revision 时创建 release。

此 gate 证明文档就绪，不替代 test、artifact provenance、signature、SBOM review、migration validation 或 runtime capability check。

## Release 来源

- [Mobazha Node release notes](https://github.com/mobazha/mobazha/tree/main/docs/releases)
- [Mobazha Unified release notes](https://github.com/mobazha/mobazha-unified/tree/main/docs/releases)
- [Published GitHub releases](https://github.com/mobazha/mobazha/releases)
- [Reviewed public source revisions](/sources.json)
- [English canonical page](/releases)
