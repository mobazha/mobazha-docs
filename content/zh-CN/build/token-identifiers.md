---
title: Token 与链上资产标识
summary: 在客户端之间使用带版本、可解析的标识，同时让精确解析行为和支持标准继续受发布版本契约约束。
status: Beta
audiences:
  - 开发者
  - 集成方
  - Agent 开发者
evidenceLabel: Unified 代币标识实现与测试
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/packages/core/utils/tokenIdentifier.ts
reviewed: 2026-07-04
translationOf: build/token-identifiers
pageType: concept
outcome: 解析和比较 Token 标识，同时不把可识别性误认为所有权、价格、转移权限或运行时支持。
estimatedTime: 6 分钟
journey: build
primaryAction:
  label: 查看标识结构
  href: /zh/build/token-identifiers#公共标识结构
---

## 公共标识结构

新标识编码大写网络名、小写合约地址、Token 标准以及 tokenId 或 slotId，例如 `SEPOLIA_0x1234..._ERC721_42`、`SEPOLIA_0x1234..._ERC1155_1` 和 `SEPOLIA_0x1234..._ERC3525_1`。

精确解析器、标准支持范围、旧格式兼容和序列化字段属于带版本的实现契约。不能直接拼接未经验证的用户输入，也不能因为标识可解析就推断资产能力已经启用。

## 身份语义

- ERC-721 与 ERC-1155 使用合约地址和 tokenId 共同确定资产身份。
- ERC-3525 集成可以用 slotId 表示资产类别，但具体持有物仍有自己的 token 身份。
- 网络是标识的一部分；不同网络上的相同地址属于不同命名空间。
- 比较前必须规范化合约地址。
- 人类可读符号只用于展示，不能作为唯一身份。

## 兼容与安全

- 旧格式只能通过维护中的解析器处理，并在迁移时保留原值作为证据。
- 未知标准和畸形标识应判断为不支持，不能猜测。
- 网络、合约和 Token 元数据必须来自可信配置或已验证链上数据。
- 标识识别必须和运行时能力、授权、所有权、价格及结算支持分开判断。
- Agent 不得仅凭可解析标识执行购买或转移，仍需有效能力和用户确认。

## 实现证据

- [标识实现](https://github.com/mobazha/mobazha-unified/blob/main/packages/core/utils/tokenIdentifier.ts)
- [RWA 类型契约](https://github.com/mobazha/mobazha-unified/blob/main/packages/core/types/rwa.ts)
- [运行时能力规则](/zh/build/runtime-capabilities)
- [English canonical page](/build/token-identifiers)
