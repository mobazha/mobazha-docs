---
title: Mobazha 如何打包与运营
summary: 比较源码构建 Node、托管服务、独立安装包和第三方 Appliance，避免混淆打包、能力和官方状态。
status: Current
audiences:
  - 卖家
  - 运营者
  - 分发者
  - 安全审查者
  - 评估者
  - Agent
evidenceLabel: Standalone 打包、分发政策、发布与供应链检查
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/deploy/standalone
reviewed: 2026-07-14
translationOf: project/distribution
pageType: policy
outcome: 在保留能力事实、安全首次运行、用户控制、恢复、许可和诚实品牌声明的前提下选择或发布 Mobazha 分发版本。
estimatedTime: 10 分钟
journey: understand
primaryAction:
  label: 比较分发形式
  href: /zh/project/distribution#分发形式
---

## 本页的位置

**Distribution** 是经过测试的 Mobazha Core、Adapter、Frontend、Configuration、Packaging、Update channel 和运营假设组合。安装器、品牌、主机或功能集合不同，并不会让它自动成为新交易协议。

| 问题 | 来源 |
|---|---|
| 应选择托管还是自行托管？ | [选择部署方式](/zh/start/choose-deployment) |
| 哪些系统拥有状态和依赖？ | [系统架构](/zh/project/architecture) |
| Package 是否允许且描述诚实？ | 本页 |
| 制品是否就绪且兼容？ | [发布范围](/zh/project/release-scope)、发布证据和[兼容性](/zh/project/compatibility) |
| 如何安装和恢复 Node？ | [自行托管指南](/zh/self-host) |

## 分发形式

| 形式 | 谁运营？ | 当前含义 | 主要责任 |
|---|---|---|---|
| Community 源码构建 | 独立卖家或运营者 | 可在受支持环境构建和评估公开候选版本源码 | 主机、秘密、网络、数据、备份、更新、集成和事故响应 |
| Mobazha 托管服务 | Mobazha 或明确托管运营者 | Beta 服务运营适用商业分发和托管基础设施 | 服务条款、可用性、租户隔离、数据处理、价格、导出和支持 |
| Standalone 安装器或 Launcher | 安装后的独立运营者 | 打包和更新机制可能处于预发布；稳定签名制品需要发布证据 | 制品完整性、首次运行、更新批准、回滚和本地恢复 |
| Container、VPS Image 或 Appliance | 独立分发者或运营者 | 在保留许可、安全、能力、来源和恢复规则时允许打包 | 安全镜像构建、披露、更新、支持和源码义务 |
| 品牌或垂直分发 | 其明确运营者 | 可选择 Profile、品牌、集成和服务组合，但不会创建新的 Core 权威 | 诚实品牌、兼容契约、明确本地功能，不做虚假官方声明 |

当前 v0.3 系列用于评估和测试网。打包源码或存在安装脚本并不能证明已发布稳定签名 Binary、自动更新或生产支持。

## 可以不同与必须保留的内容

| Distribution 可以选择 | Distribution 必须保留 |
|---|---|
| 托管或自行托管运营模式 | 拥有订单的后端和 Core 状态权威 |
| 包含的公开 Adapter 和 Build-time feature | 有效能力发现和 fail-closed 行为 |
| Store、Marketplace、Embedded 或 Vertical presentation | 后端授权和受保护状态转换 |
| 品牌、域名、Theme、Support 和 Pricing | 诚实披露服务商、付款方、收款方、数据和责任 |
| 基础设施服务商和更新渠道 | 制品来源、秘密安全、备份、恢复、导出和回滚 |
| Distribution-local feature | 公开契约兼容，并与 Mobazha 项目政策明确分离 |

Frontend switch、Bundled adapter 或产品名称不能扩大后端安全实现的范围。分发者可以增加服务，但必须说明服务商，不能隐藏外部依赖或把资金权威移入展示代码。

## 用户如何选择分发版本

信任 Package 或托管服务前，询问：

1. 谁发布和运营它？是否声称官方身份？
2. 包含哪个精确 Mobazha 版本、源码 revision、Capability manifest 和 Frontend？
3. 哪些服务是本地、托管、第三方、可选或必需？
4. 店铺数据、Identity key、Payment credential 和恢复材料存放在哪里？
5. 首次凭据如何生成，更新如何验证，备份如何创建，数据如何导出，失败如何回滚？
6. 适用哪些费用、限制、支持条款和外部 Endpoint？
7. 分发者或可选服务消失后，店铺和现有订单如何继续？

如果发布者无法回答这些问题，安装器的便利性不能建立信任。

## 分发者要求

### 构建与来源

- 记录精确源码 commit 或 tag、构建输入、Capability manifest、Frontend revision、License、SBOM、Checksum、Provenance 和测试结果。
- 不得包含未批准付款能力、私有 Control-plane code、隐藏支持访问、客户数据、服务商凭据或预生成用户秘密。
- 为精确制品履行对应源码、Notice、Attribution 和第三方 License 义务。

### 安全首次运行

- 在用户系统上生成管理员凭据、店铺身份、签名材料和本地秘密；若使用托管边界，必须明确披露。
- 以最小网络暴露启动，并要求明确配置 TLS、Proxy、Firewall、Domain 和远程管理。
- 展示外部 Endpoint、Telemetry、Update check 和可选托管连接；契约允许时应可禁用。

### 更新与恢复

- 通过文档化渠道签名并发布更新 Metadata，替换前验证完整性。
- 说明更新是自动、提示、运营者控制还是不可用。
- 迁移前备份，保留兼容回滚点，测试恢复，并说明 Reset 和 Export 路径。
- 禁用新能力后，仍应服务历史服务商绑定及现有订单恢复。

### 产品事实

- 只宣传该 Distribution 已包含、配置、授权、健康并测试的有效能力。
- 区分 Mobazha 项目政策与分发者自己的条款、价格、隐私、支持和本地功能承诺。
- 没有相应证据和授权，不得声称 Official、Certified、Audited、Production-ready 或 Compatible。

## 品牌与认证

开源许可不授予 Mobazha 名称、Logo 或认证声明权。第三方 Image 可以准确说明包含 Mobazha 并标注源码 revision，但没有单独授权不能暗示 Mobazha 运营、认可、审计或支持该 Package。

未来认证项目可能检查来源、发布材料、能力事实、首次运行安全、更新、恢复和兼容性。参与公开契约不以认证为必要条件；认证项目正式发布前，“Mobazha Certified”不是有效公开状态。

## 重要使用前验证

1. 安装到可丢弃环境或测试网。
2. 验证制品身份、本地 Listener、Runtime profile、声明能力和外部连接。
3. 创建店铺，完成一次代表性商品、Quote、付款、履约和恢复流程。
4. 使用文档指定的兼容版本创建并恢复备份。
5. 演练更新与回滚判断，不删除唯一店铺副本。
6. 接受重要交易前记录运营者、支持路线、周期成本和事故负责人。

- [安装自行托管 Node](/zh/self-host/install)
- [监控 Node](/zh/self-host/monitoring)
- [备份与升级](/zh/self-host/backup-and-upgrade)
- [检查法律、隐私、许可与商标边界](/zh/project/legal-and-privacy)
- [English canonical page](/project/distribution)
