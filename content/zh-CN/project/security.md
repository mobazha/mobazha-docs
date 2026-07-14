---
title: 项目安全模型
summary: Mobazha 安全依赖明确权威、fail-closed capability、受保护签名材料、敌意输入假设与私下披露。
status: Beta
audiences:
  - 运营者
  - 开发者
  - 安全审核者
  - 评估者
evidenceLabel: Mobazha 公开安全来源
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/SECURITY.md
reviewed: 2026-07-14
translationOf: project/security
pageType: policy
outcome: 理解项目安全边界，并通过私下报告渠道处理疑似漏洞。
estimatedTime: 6 分钟
journey: understand
primaryAction:
  label: 查看安全报告方式
  href: /zh/project/security#安全报告
---

## 信任边界

- 拥有订单的 backend 是其状态与受保护转换的权威。
- Client 是不受信任输入与 presentation layer；隐藏控件不能替代 server authorization。
- Payment rail、RPC、indexer、plugin、webhook、media 与 delivery system 是有独立 threat/failure model 的外部依赖。
- Extension 取得最小 typed projection 与 scoped handle，而非通用 database 或 Core access。
- 敏感操作要可审计，但日志不应包含 secret 或无关个人资料。

## Release 与供应链

当前 release 是 pre-release candidate。最终 artifact 仍需 vulnerability scanning、dependency/license review、SBOM、checksum、provenance、reproducibility evidence、secret scan 与平台验证。

- [Node supply-chain audit](https://github.com/mobazha/mobazha/blob/main/docs/security/SUPPLY_CHAIN_AUDIT.md)
- [Unified supply-chain audit](https://github.com/mobazha/mobazha-unified/blob/main/docs/security/SUPPLY_CHAIN_AUDIT.md)
- [运营者安全](/zh/self-host/security)

## 安全报告

使用受影响仓库的 GitHub private vulnerability reporting。不要在 issue、chat 或文档反馈中公开 exploit 细节、泄露凭据、签名密钥问题或客户数据。

- [English canonical page](/project/security)
