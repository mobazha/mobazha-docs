---
title: Mobazha 接下来要验证什么
summary: 查看项目正在验证的产品结果、推进所需证据，以及仍属于探索而非承诺的方向。
status: Draft
audiences:
  - 用户
  - 贡献者
  - 运营者
  - 开发者
  - 评估者
  - Agent
evidenceLabel: 公开发布范围、仓库 milestone、audit 与已审核产品路线图
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-14
translationOf: project/roadmap
pageType: concept
outcome: 理解项目接下来要验证的结果、对用户的意义，以及方向成为发布承诺前必须具备的证据。
estimatedTime: 8 分钟
journey: understand
primaryAction:
  label: 查看当前验证目标
  href: /zh/project/roadmap#当前验证目标
---

## 当前验证目标

Roadmap 描述期望的用户与产品结果，不是交付日历或 capability 存在证据。内部计划中的日期或条目，只有经过 accepted、implemented、tested、documented 与 released 才成为公开承诺。

近期目标不是功能数量，而是让不同角色能完成并验证一条可信候选版本闭环：

| 用户 | 要验证的结果 | 成功证据 |
|---|---|---|
| 买家 | 看懂卖家、总额、付款指示、订单状态与恢复路径 | 一笔具有 Quote、Payment Session、履约与恢复状态的完整测试订单 |
| 卖家 | 配置店铺、发布 Offer、收到付款证据、履约与售后 | 无隐藏管理员修复的可重复 store-to-order 操作 |
| 运营者 | 运行健康、安全、可恢复的 backend | Diagnostics、monitoring、backup restore、upgrade decision 与 incident owner |
| 开发者 / Agent 构建者 | 发现 capability、窄认证、调用公开 contract 并核对未知结果 | 覆盖 denial、retry、duplicate、conflict 与 recovery 的 versioned test |
| 评估者 | 区分当前行为、可选服务、费用、依赖与未来方向 | 一致的 release、policy、compatibility 与 source evidence |

## 近期结果主线

- 买卖旅程：让总额、付款进度、履约、退款与争议清晰可测。
- Standalone 运营：证明 secure first run、监控、restore、migration、rollback 与支持。
- Hosted / independent 一致性：共享 contract、真实 runtime capability、跨 distribution conformance，并披露服务差异。
- 付款与保障：分开付款事件、已验证付款、订单状态、settlement 与 buyer protection。
- 公开集成：用 scoped credential、stable contract、idempotency、capability gate、approval 与 failure test 限制 API、MCP、webhook 和 Agent 权限。
- 发布信任：用 checksum、provenance、SBOM、compatibility、migration、known issue 与文档证明可用性。

## 仍受 Gate 限制的探索

更丰富 community market、Deal Link、更多 payment/protection model、AI/Agent/Skill、multi-store、更多 channel、launcher 与更广 extension runtime 都仍是探索。每项必须先证明相应 operator responsibility、privacy、custody、authorization、failure semantics、cost control、recovery 与 compatibility。

Roadmap 不承诺每个 adapter 都发布、所有 deployment 能力相同、固定日期、永久免费或零外部成本、统一佣金模型、Token 回报，也不允许 Agent、plugin、marketplace 或 hosted service 绕过 store、order、payment 或 user authority。

## 结果如何成为 Current

1. 记录真实用户问题与目标结果。
2. 审核 product、security、economic、legal 与 operational 边界。
3. 定义公开 contract 与 capability behavior。
4. 在相关 distribution 测试 implementation 与 migration。
5. 让 user journey、failure recovery、documentation 与 support evidence 一致。
6. Release 发布 scope、artifact、known issue 与 compatibility evidence。

- [发布范围](/zh/project/release-scope)
- [公开决定与提案](/zh/project/decisions)
- [English canonical page](/project/roadmap)
