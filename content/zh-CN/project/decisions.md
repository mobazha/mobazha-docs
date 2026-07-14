---
title: 公开决定与提案
summary: 用 RFC 记录仍在评估的变更，用 ADR 记录已经作出的决定，用 History 保存被取代的公开材料。
status: Current
audiences:
  - 贡献者
  - 维护者
  - Agent
  - 评估者
evidenceLabel: Mobazha 文档决策流程
evidenceUrl: https://github.com/mobazha/mobazha-docs/blob/main/docs/CONTENT_GOVERNANCE.md
reviewed: 2026-07-14
translationOf: project/decisions
pageType: hub
outcome: 为要提出或检查的决定选择 RFC、ADR、政策页、Release note 或 History record。
estimatedTime: 5 分钟
journey: understand
primaryAction:
  label: 选择记录类型
  href: /zh/project/decisions#选择正确记录
---

## 选择正确记录

- RFC：仍需审核、证据或决定的重大公开提案。
- ADR：持久架构或产品决定，记录上下文、替代方案、后果与 supersession。
- History record：保留已替换或撤回的公开陈述，使旧链接和讨论仍可解释。
- Task documentation：从当前权威推导的操作与解释，不能替代决策记录。

## 生命周期规则

- Draft 或 Review RFC 不是已交付行为。
- Accepted RFC 授权实现工作，但不能证明已实现或发布。
- ADR 记录决定；运行时行为仍需 implementation、test、capability gate 与 release evidence。
- 被取代记录保持可读并链接 replacement。
- 安全敏感细节、凭据、私有运营、客户数据、预测与未批准商业假设不进入公开记录。

## 开始或检查记录

- [RFC 索引](/zh/project/rfcs)
- [ADR 索引](/zh/project/adrs)
- [History 与 Supersession](/zh/project/history)
- [文档治理](/zh/project/governance)

> **Important:** 记录状态必须始终明确。不能从提案、已接受设计或代码存在推断 capability 可用。

- [English canonical page](/project/decisions)
