---
title: Architecture Decision Records
summary: 保存持久技术与产品决定的理由、被拒替代方案，以及将来如何取代。
status: Current
audiences:
  - 贡献者
  - 维护者
  - 架构师
  - Agent
evidenceLabel: Mobazha 公开 ADR registry
evidenceUrl: https://github.com/mobazha/mobazha-docs/tree/main/adrs
reviewed: 2026-07-14
translationOf: project/adrs
pageType: hub
outcome: 查找 accepted architecture decision，并与提案或仓库本地实现说明区分。
estimatedTime: 5 分钟
journey: understand
primaryAction:
  label: 打开 ADR Registry
  href: /zh/project/adrs#当前-registry
---

## 哪些内容属于 ADR

- 长期架构、权威、ownership、compatibility 或 publication decision。
- 不记录就会反复重新推导理由的选择。
- 影响多个 module、repository、deployment type 或 public contract 的决定。

Editorial change、日常实现细节与临时实验通常不需要 ADR。

## 当前 Registry

- [ADR-0001: Markdown files are the documentation content authority](https://github.com/mobazha/mobazha-docs/blob/main/adrs/0001-markdown-content-authority.md) — Accepted。
- [ADR-0002: Mobazha Docs owns public knowledge](https://github.com/mobazha/mobazha-docs/blob/main/adrs/0002-public-knowledge-authority.md) — Accepted。
- [ADR template](https://github.com/mobazha/mobazha-docs/blob/main/adrs/0000-template.md)
- [Repository ADR guide](https://github.com/mobazha/mobazha-docs/blob/main/adrs/README.md)

## 仓库拥有的架构决定

跨仓库索引只链接决定的 owner，不在本仓库复制或重新编号。

- [Open Core ADR-018: Extension architecture](https://github.com/mobazha/mobazha/blob/main/docs/adr/018-open-core-extension-architecture.md)
- [Open Core Extension 指南](/zh/build/extensions)

## 安全阅读 ADR

Accepted ADR 解释预定持久决定，但不会自行激活 capability、迁移 deployment，或证明每个仓库已完成。适用时仍要检查 implementation、conformance test、release note 与 effective runtime capability。

- [English canonical page](/project/adrs)
