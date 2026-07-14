---
title: 保护自行托管的 Node
summary: 把主机、管理边界、签名材料、付款集成、备份与恢复路径作为一个系统保护。
status: Beta
audiences:
  - 运营者
  - 安全审核者
evidenceLabel: Mobazha 安全政策与 Extension 安全模型
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/SECURITY.md
reviewed: 2026-07-14
translationOf: self-host/security
pageType: policy
outcome: 为自己运营的 Node 建立最低主机、身份、secret、付款、监控与恢复控制。
estimatedTime: 10 分钟
journey: operate
primaryAction:
  label: 检查运营者基线
  href: /zh/self-host/security#最低运营者基线
---

## 最低运营者基线

- 使用专用、已修补的主机和最小权限 service account。
- Admin API 默认保持私密；远程暴露前加入 TLS、authentication、rate limit 与 network policy。
- 分别保护 seed phrase、private key、API token、webhook secret 与 backup。
- 把每个 chain RPC、indexer、plugin、webhook 与 delivery integration 当作恶意输入边界审核。
- 监控健康、存储、认证失败、付款观察、webhook 投递与意外 capability 变更。
- 在版本或基础设施变更前测试 restore 与 rollback。

## 资金边界

- 只有 Core policy 可以改变付款、退款、争议或 settlement 状态。
- Extension 与外部服务不得获得原始 seed phrase 或 private key。
- 付款 observation 不是结算权限；仍要检查预期状态、身份、金额、confirmations 与 idempotency。
- 禁用不健康 capability 必须 fail closed，不能静默选择另一种资金行为。

## 私下报告漏洞

怀疑存在漏洞、凭据泄露、签名密钥问题或 exploit 时，不要创建公开 issue。请从受影响仓库的 Security 页使用 GitHub private vulnerability reporting。

- [Node security policy](https://github.com/mobazha/mobazha/security/policy)
- [Supply-chain audit baseline](https://github.com/mobazha/mobazha/blob/main/docs/security/SUPPLY_CHAIN_AUDIT.md)
- [English canonical page](/self-host/security)
