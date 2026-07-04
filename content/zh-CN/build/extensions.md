---
title: 通过公共契约扩展 Mobazha
summary: 选择最窄的类型化扩展机制，并保留 Core 权威、能力门槛、运行隔离、恢复和审计边界。
status: Draft
audiences:
  - 扩展开发者
  - 架构师
  - 安全审核者
evidenceLabel: Mobazha Open Core 扩展契约
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/docs/extensions
reviewed: 2026-07-04
translationOf: build/extensions
---

## 选择正确的机制

- Port：替换 Core 所需能力的一种实现。
- Module：把经过审核的能力组合进一个发行形态。
- Function：定制有边界且确定性的业务决策。
- Controller：协调外部系统或执行外部 I/O。
- OrderExtension：把带版本的资源或跨阶段领域过程绑定到订单。

应选择只承担一个职责的最窄机制。一个包可以实现多个角色，但每个公共契约只能有一个权威边界。回调不会自动成为 Port，Module 也不是服务定位器。

## 保留 Core 权威

扩展只能提交声明、决策、观察或证明。Core 校验身份、授权、模式与契约版本、资源绑定、预期状态、幂等性、新鲜度和策略，然后才创建由 Core 拥有的命令或持久事实。

```text
扩展输入
  -> Core 校验
  -> Core 命令或持久事实
  -> Core 状态机
  -> 审计，并通过受限适配器执行外部动作
```

- 类型化领域契约可以表达需求时，不增加全局通用 Hook。
- Core 保留发布策略、订单状态、支付验证、结算门槛、审计和密钥托管权威。
- 第三方代码不得导入 internal 包、接收完整 Core 对象或访问原始签名材料。
- 扩展不得写 Core 数据表，也不得直接调用内部状态迁移。
- 支付、退款、争议和结算变化必须重新进入带版本和幂等保护的 Core 命令与状态机。

## 设计规则

- Ports 为窄小、由 Core 定义的能力提供可替换性。
- Modules 提供不可变的启动期组合，并声明身份、版本、依赖、能力、配置、运行类型和生命周期。
- Functions 有边界且确定性，不获得网络、数据库、密钥、时钟或状态迁移权限。
- Controllers 消费持久 Core 事实来协调外部系统，只返回观察或证明。
- 所有模块遵守统一治理，但业务接口保持窄小、类型化和领域化。
- 新扩展点必须有所有者、模式、权限边界、失败语义、幂等与恢复模型、测试和移除计划。
- 不提供全局命名 Hook 总线、运行时可变注册表或万能 Core 服务定位器。

## 评审中的目标平台模型

Draft 状态的[可组装扩展平台 RFC](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0002-composable-extension-platform.md)把长期目标整理为：

```text
模块控制面
  -> 按信任分级的运行时层
  -> 类型化领域契约与 Core 命令门
  -> Core 拥有的商务内核
```

控制面治理身份、兼容性、依赖、授权、配置、健康和生命周期；运行时驱动决定代码在哪里执行；类型化契约限制可以交换什么；只有 Core 能决定输入是否可以改变 Core 拥有的状态。

以下维度彼此独立，不能压成一个混杂的插件分类：

| 维度 | 示例 |
|---|---|
| 包装与发布 | Module |
| 业务领域 | 支付、订单资源、库存、履约、税务、通知 |
| 契约角色 | Port、Function、Controller、类型化领域契约 |
| 输出权威 | 声明、决策、观察、证明 |
| 交互方式 | 同步调用、持久事件、对账 |
| 运行方式 | 进程内静态组合、隔离进程或远程、Wasm |
| 信任级别 | 第一方、经审核合作方、不可信 |
| 生命周期 | Desired、Verified、Ready、Degraded、Draining、Failed |
| 数据所有权 | Core、模块或外部系统 |

该模型目前是 Draft 方向，不代表每个控制面门槛和运行时都已可用。

## 保持领域能力族独立

- 支付是 Core 拥有的限界上下文。托管支付、直接观察支付和提供方结账会话可以使用不同适配器，但支付、退款、争议和结算状态仍由 Core 拥有。
- OrderExtension 通过声明、预留、持久投递、观察或证明中的必要子契约，把订单关联资源或跨阶段领域过程绑定到订单。
- 库存、履约、税务、通知等提供方能力保留窄小的类型化契约和明确所有者。
- 内容、消息、密钥、存储等 Core 必需基础设施在用于替换实现时仍是 Port，不因此变成任意业务 Module。

统一模块治理不等于一个万能业务接口。

## 能力与信任门槛

所有激活门槛通过后，扩展能力才可见。源码存在、标识符已知或代码已经链接，都不等于能力已启用。

```text
发行允许列表
  ∩ 契约兼容
  ∩ 已安装或静态组合
  ∩ 已授权
  ∩ 已配置
  ∩ 健康
```

- 经审核的第一方模块默认静态链接。
- 独立分发或第三方基础设施默认在进程外运行。
- 商家编写的决策规则在该运行时引入后，应进入 Wasm 等受限沙箱。
- 降低隔离等级需要威胁分析和架构决策。

## 当前实现边界

静态 Order Extension v1 当前已经校验精确契约名称、不可变启动期组合、依赖与循环、能力和接口的一致性，并在缺失能力时失败关闭。它也已经提供只追加的扩展记录、持久生命周期投递、类型化预留绑定，以及重新进入 Core 结算命令的结算证明。

发行允许列表、按租户授权和配置、结构化模块健康、drain、升级、回滚、第三方进程运行时及 Wasm Function 运行时仍是治理目标，不能描述为已经普遍可用。

## OrderExtension 范围与首个提供方

OrderExtension 不是 Collectibles 或 NFT 分类。当订单关联绑定必须在重启或提供方缺席时仍可恢复、稀缺容量需要在付款前预留、外部工作需要持久驱动，或者 Core 在自身状态迁移前必须校验证据时，才应使用该契约。

候选资源包括收藏卡 Hub 名额、限量库存、礼品卡兑换额度、活动门票、受监管商品批次和定制生产名额。它们只是建模候选，不代表对应提供方已经交付。每个提供方保留独立命名空间类型和私有领域载荷，并且只获得所需的子能力。

Collectibles 是首个已实现的提供方：

- 签名 NFT 元数据成为由 Collectibles 模块生成、带版本的 OrderExtension 声明。
- Token 或库存分配在创建资金目标前通过模块拥有的 ReservationPort 完成。
- 铸造和交付是由持久扩展事件驱动的 Controller 工作。
- 交付证据成为由模块校验的 SettlementAttestation。
- 卖家收款仍由已有 Core 条件结算命令执行。
- NFT、链、铸造、证书和提供方词汇不进入通用 Core API。

Collectibles 用来验证第一个实现切片，但不定义 OrderExtension 的范围，也不把 NFT 概念提升为万能 Core 抽象。开发期直接切换已经移除产品专用 Hook、结算命令、队列和 FiatMetadata 镜像。

## 评审新的扩展点

- 明确领域所有者、业务目的、调用者、声明者和授权者。
- 分别对输入、输出、描述符和兼容行为进行版本管理。
- 定义同步或持久投递、顺序、幂等、超时、重试、死信和对账行为。
- 声明能力门槛、权限、敏感数据以及重新进入 Core 状态机的位置。
- 提供迁移、回滚、移除、可观测性、负向测试和一致性证据。

如果这些答案尚不稳定，应把机制保留为私有实现细节，而不是发布另一个通用扩展点。

## 权威文档

- [ADR-018：Open Core 扩展架构](https://github.com/mobazha/mobazha/blob/main/docs/adr/018-open-core-extension-architecture.md) — 角色、权限边界、信任模型和架构不变量。
- [扩展架构入口](https://github.com/mobazha/mobazha/blob/main/docs/extensions/README.md)
- [能力与安全模型](https://github.com/mobazha/mobazha/blob/main/docs/extensions/CAPABILITY_AND_SECURITY_MODEL.md)
- [模块生命周期](https://github.com/mobazha/mobazha/blob/main/docs/extensions/MODULE_LIFECYCLE.md)
- [Order Extension 契约](https://github.com/mobazha/mobazha/blob/main/docs/extensions/ORDER_EXTENSION_CONTRACT.md)
- [Collectibles Order Extension 演进](https://github.com/mobazha/mobazha/blob/main/docs/extensions/ORDER_EXTENSION_EVOLUTION_PLAN.md)
- [一致性测试](https://github.com/mobazha/mobazha/blob/main/docs/extensions/CONFORMANCE.md)
- [支付插件架构](https://github.com/mobazha/mobazha/blob/main/docs/plugins/PAYMENT_PLUGIN_ARCHITECTURE.md)
- [Draft 可组装扩展平台 RFC](https://github.com/mobazha/mobazha-docs/blob/main/rfcs/0002-composable-extension-platform.md) — 目标平台模型，不是已交付能力的权威来源。
- [English canonical page](/build/extensions)
