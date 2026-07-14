---
title: 申请在社群市场销售
summary: 在申请、撤回或重新申请前，先阅读市场的卖家准入、审阅和 Catalog 规则。
status: Beta
audiences:
  - 卖家
  - 市场运营者
evidenceLabel: Unified Native Marketplace 卖家政策与测试
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/apps/web/src/app/marketplace/%5Bslug%5D/sell/page.tsx
reviewed: 2026-07-14
translationOf: sell/marketplace-participation
pageType: task
lastTested: 2026-07-14
outcome: 提交一项符合条件的市场申请，理解当前 Membership state，并只使用该状态允许的转换。
estimatedTime: 5–10 分钟
journey: use
primaryAction:
  label: 检查卖家资格
  href: /zh/sell/marketplace-participation#开始前
---

## 开始前

- 以负责目标店铺和 Product group 的卖家身份登录。
- 打开选中的市场，确认其身份、运营者、Seller entry mode、Seller review mode 和 Catalog mode。
- 把市场 Membership 视为发现与策展关系。批准不会把 Store、Listing、Quote、Payment 或 Order authority 转移给市场。
- 只有部署公开市场卖家页且市场允许自助申请时才继续。

> **Important:** `operator_invited` 市场不接受自助申请。没有 Submit control 是政策结果，不是调用隐藏 Route 的理由。

## 申请加入市场

1. 打开市场的 **Sell** 入口，通常是 `/marketplace/{slug}/sell`。
2. 选择商品前阅读显示的 Seller entry、Review、Buyer access 和 Catalog 规则。
3. Curated catalog 要求选择至少一个属于当前卖家的 Product group。即使 Group 目前有零个商品，也可以符合申请条件。Open catalog 可以允许不选 Group 提交。
4. 复核选中 Group 并提交一次。请求进行时 Submit control 仍显示但不可再次点击。
5. 阅读返回的 Membership state。Automatic review 可能立即批准；Manual review 通常记录 `applied` 并等待运营者决定。
6. 返回同一卖家页查看 Review update。Notification 可以把用户带到该页，但当前 Application 和 Membership record 才决定状态。

## 理解当前状态

| 状态 | 卖家可以得出的结论 | 可用下一步 |
|---|---|---|
| No application | 没有当前自助申请 | 市场允许时选择所需 Group 并提交 |
| `applied` | 申请已存在并等待决定 | 保持选择锁定；产品提供时可以撤回 |
| `approved` | 市场已按当前政策接受卖家 | 检查哪些 Group 和 Listing 可见；批准不证明订单已就绪 |
| `rejected` | 申请被拒绝 | 阅读可用 Decision reason；只有当前政策公开提交时才重新申请 |
| `left` | 卖家已撤回或离开 | 当前政策允许时重新申请 |
| `suspended` | 运营者已暂停参与资格 | 不要自助重新申请；使用市场运营者公开的复核路线 |

当申请处于 `applied`、`approved` 或 `suspended` 时，Group selection 保持锁定，防止本地 Draft 悄悄改变活动 Membership 关联的 Group。

## 预期结果与验证

卖家页应为选中的市场与卖家上下文显示一项当前 Application 和 Membership state。刷新后核对 Marketplace identifier、Store 或 Seller identity、选中的 Product-group identifier、Review mode 和当前状态。

卖家获得批准后，还要单独确认目标 Group 或 Listing 在市场中可见，并且买家 Handoff 仍解析到正确的卖家后端。Membership 本身不能证明 Availability、Price、Payment readiness 或 Fulfillment readiness。

## 失败时

- Curated market 中 Submit 被禁用时，选择至少一个符合条件的 Product group，并确认它属于当前卖家。
- 市场由邀请控制时，不要反复提交 API 请求；使用运营者公开的准入路线。
- Submit 或 Withdraw 结果未知时，重试前刷新当前 Application。延迟响应可能已经改变 Membership state。
- 在 `rejected` 或 `left` 后，只有页面再次公开提交动作时才新建申请。Suspended seller 不能自助重新申请。
- Notification 与卖家页不一致时，以刷新后的 Membership record 为准，并使用脱敏标识符报告过期通知。

## 继续

- [理解市场与发现](/zh/project/community-commerce)
- [维护 Product group 与供应](/zh/sell/catalog-operations)
- [验证买家 Checkout 边界](/zh/buy/checkout)
- [English canonical page](/sell/marketplace-participation)
