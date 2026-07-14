---
title: 了解 Mobazha 项目
summary: 区分当前产品模型、实现基础、长期方向与可依赖的项目事实，避免把愿景、政策和已交付能力混为一谈。
status: Current
audiences:
  - 所有人
  - 贡献者
  - 评估者
evidenceLabel: Mobazha 公开仓库与项目记录
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-14
translationOf: project
pageType: hub
outcome: 根据问题进入正确的知识分组，并了解当前中文文档的覆盖边界。
estimatedTime: 4 分钟
journey: understand
primaryAction:
  label: 查看产品地图
  href: /zh/project/product-map
---

## 按问题选择入口

| 想了解的问题 | 从这里开始 |
|---|---|
| Mobazha 的店铺、市场、渠道和 Agent 如何组合？ | [产品地图](/zh/project/product-map) |
| 订单如何经过支付、履约、完成和恢复？ | [交易主线](/zh/project/transaction-spine) |
| 费用由谁收取，如何理解经济边界？ | [收费与经济模式](/zh/project/fees) |
| Mobazha 为什么存在，长期原则是什么？ | [创始白皮书](/zh/project/whitepaper) |
| 当前版本、系统边界或治理记录具体是什么？ | [英文项目事实入口](/project) |

## 中文知识分组

| 左侧分组 | 用途 | 当前中文覆盖 |
|---|---|---|
| 产品模型 | 解释用户会遇到的对象、关系和交易主线 | 产品地图、身份与店铺、Offer 与履约、交易、市场、集成、Agent |
| 产品基础 | 解释产品模型下面的运行与经济规则 | 系统架构、收费、兼容性、Packaging 与 Distribution |
| 愿景与方向 | 解释项目存在的原因、长期原则与证据门槛 | 白皮书 v0.2、Draft 产品路线图 |
| 信任与治理 | 区分当前事实、政策、发布证据和治理记录 | 安全、法律与隐私、发布范围、治理、RFC、ADR、历史与 Release |

顶部导航与英文站使用同一逻辑：**买卖、运营、开发、产品、项目、社区**。产品覆盖前三个解释性分组；项目承载信任与治理。Mobazha Docs 标志返回中文起始页。

## 当前中文覆盖边界

除已单独校验的白皮书外，当前英文文档均已有同路径中文对应页，并通过翻译元数据、内部链接、内容治理与发布检查。中文页提供同等任务入口，但英文仍是第一阶段政策与产品事实的 canonical authoring authority。

- 精确 API operation 与 Schema 继续由共用的 [API Reference](/api-reference) 和 [OpenAPI JSON](/openapi.json) 提供，不复制 359 个 operation。
- 每个中文页保留与英文一致的 lifecycle status、page type、journey、version 与适用 visual，并明确链接英文 canonical page。
- Runtime、交易、发布与法律事实仍由连接后端、订单记录、版本合约、tagged release 或其公开 policy owner 决定；翻译不会扩大产品、收费或治理承诺。
