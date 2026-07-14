---
title: Mobazha 可以怎样打包与运营
summary: 比较源码构建 Node、托管服务、standalone package 与第三方 appliance，同时不把 packaging 当作 capability 或官方身份。
status: Current
audiences:
  - 卖家
  - 运营者
  - Distribution 发布者
  - 安全审核者
  - 评估者
  - Agent
evidenceLabel: Standalone packaging、distribution policy、release 与 supply-chain checks
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/deploy/standalone
reviewed: 2026-07-14
translationOf: project/distribution
pageType: policy
outcome: 选择或发布 Mobazha distribution，同时保留 capability 真实性、安全首次运行、用户控制、恢复、许可与诚实品牌表达。
estimatedTime: 10 分钟
journey: understand
primaryAction:
  label: 比较 Distribution 形式
  href: /zh/project/distribution#distribution-形式
---

## Distribution 形式

Distribution 是 Mobazha Core、adapter、frontend、configuration、packaging、update channel 与 operating assumption 的已测试组合；更换 installer、brand 或 host 不会创造新商业协议。

| 形式 | 运营者 | 当前含义 |
|---|---|---|
| Community source build | 独立卖家或运营者 | 公开候选源码可在受支持环境构建评估；运营者负责主机、secret、网络、数据、备份、更新与事件响应 |
| Mobazha hosted service | Mobazha 或具名托管运营者 | Beta 服务运行适用 commercial distribution；其条款负责可用性、隔离、数据、价格、导出与支持 |
| Standalone installer / launcher | 安装后的独立运营者 | Packaging 与更新机制可能处于预发布；稳定签名 artifact 仍需 release evidence |
| Container、VPS image 或 appliance | 独立 distribution 发布者或运营者 | 只有保留许可、安全、capability、provenance 与恢复规则时才是允许的 packaging |
| Branded / vertical distribution | 具名运营者 | 可选择 profile、brand、integration 与 service bundle，但不创造新 Core authority |

v0.3 当前只用于评估与 Testnet。Packaging source 或安装脚本不能证明稳定签名 binary、自动更新或生产支持已发布。

## 可以改变与必须保留

Distribution 可以选择运营模型、公开 adapter、展示、品牌、基础设施和本地功能；但必须保留：

- 拥有订单的 backend 与 Core state authority；
- effective capability discovery 与 fail-closed behavior；
- backend authorization 与受保护 state transition；
- 对 provider、payer、recipient、data 与责任的诚实披露；
- artifact provenance、secret safety、backup、restore、export 与 rollback；
- 公开 contract compatibility，并与项目政策清楚分离。

Frontend switch、bundled adapter 或 product name 不能扩大 backend 安全实现的内容。

## 用户选择前的七个问题

1. 谁发布并运营，是否声称官方身份？
2. 包含哪个准确版本、source revision、capability manifest 与 frontend？
3. 哪些服务是 local、hosted、third-party、optional 或 required？
4. Store data、identity key、payment credential 与 recovery material 存放在哪里？
5. 首次凭据、更新、备份、导出与 rollback 如何工作？
6. 适用哪些费用、限制、支持条款与外部 endpoint？
7. Distribution 或可选服务消失时，店铺与既有订单怎么办？

## 发布者要求

- 记录准确 commit/tag、build input、manifest、frontend revision、license、SBOM、checksum、provenance 与 test result。
- 不包含未批准付款能力、私有 control plane、隐藏支持入口、客户数据、provider credential 或预生成用户 secret。
- 首次运行在用户系统或明确托管边界生成凭据与签名材料，并从最小网络暴露开始。
- 更新有签名 metadata、完整性验证、备份、兼容 rollback、restore、reset 与 export 说明。
- 只宣传 included、configured、authorized、healthy 且 tested 的 effective capability。
- 未有证据与授权时，不得称 Official、Certified、audited、production-ready 或 compatible。

开源许可不授予 Mobazha 名称、logo 或 certification claim。正式认证计划发布前，“Mobazha Certified”不是有效公开状态。

- [安装 Node](/zh/self-host/install)
- [法律、隐私、许可与商标](/zh/project/legal-and-privacy)
- [English canonical page](/project/distribution)
