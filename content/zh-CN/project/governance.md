---
title: 文档与政策治理
summary: 重要项目陈述需要 owner、source、review date、status 与清晰变更路径。
status: Draft
audiences:
  - 贡献者
  - 维护者
  - Agent
evidenceLabel: Mobazha 公开治理与文档政策
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/GOVERNANCE.md
reviewed: 2026-07-14
translationOf: project/governance
pageType: policy
outcome: 确认政策、合约、发布、文档或实现变更所需的审核与发布路径。
estimatedTime: 8 分钟
journey: understand
primaryAction:
  label: 分类变更
  href: /zh/project/governance#变更类别
---

## 变更类别

- Editorial：澄清措辞，不改变行为或政策。
- Operational：改变安装、恢复、兼容或集成指南。
- Policy：改变权利、责任、收费、治理、隐私或安全预期。
- Protocol：改变互操作行为、状态转换或机器合约。

## 审核预期

项目级公开政策与解释在本仓库变更。运营与 protocol implementation 在 owner 仓库变更，并同步受影响文档、machine-readable index、test、contract 与 release note。任何一层都不能静默覆盖 runtime state 或 versioned interface contract。

## 文档发布流程

- Wave 0 盘点 authority、public source、lifecycle 与 stable URL。
- Wave 1 保持 portal、兼容路由、source mapping、link check 与 deployment 健康。
- Wave 2 从实现与公开合约生成 task-first 用户、运营与开发指南。
- Wave 3 发布审核后的 trust、security、economic、governance、ADR、RFC 与 whitepaper 内容。
- Wave 4 评估 Agent 回答、维护 translation，并测量 freshness 与 support outcome。

- [Phase DOCS roadmap](https://github.com/mobazha/mobazha-docs/blob/main/docs/PHASE_DOCS_ROADMAP.md)
- [Content governance](https://github.com/mobazha/mobazha-docs/blob/main/docs/CONTENT_GOVERNANCE.md)
- [English canonical page](/project/governance)
