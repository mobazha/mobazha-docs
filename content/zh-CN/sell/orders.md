---
title: 处理进店订单
summary: 核对付款、确认义务、记录履约证据，并只使用状态允许的取消、退款、争议与完成操作。
status: Beta
audiences:
  - 卖家
  - 运营者
  - Agent
evidenceLabel: Unified 订单管理与 Node 订单状态合约
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/orders
reviewed: 2026-07-14
translationOf: sell/orders
pageType: task
lastTested: 2026-07-04
outcome: 只使用当前状态有效的操作，把一笔已付款订单推进到履约。
estimatedTime: 每次检查约 5 分钟
journey: use
primaryAction:
  label: 检查进店订单
  href: /zh/sell/orders#开始前
---

## 开始前

- 接单前发布履约与退款政策。
- 监控后端、付款依赖、库存与买家沟通。
- 区分订单通知与权威订单、付款状态。

## 把订单工作区看成四组相连记录

当前客户端在 `/admin/orders` 提供卖家工作区，在 `/orders/{orderId}` 提供订单详情。详情可分别展示 Summary、Discussion、Dispute 与 Evidence；任何一项都不能替代其他记录。

| 记录 | 用途 | 权威规则 |
|---|---|---|
| Order summary | 已接受的 Listing 快照、参与方、金额、交付义务、当前状态与有效操作 | 每次重要状态转换后重新加载。 |
| Payment Session | Funding target、观察、验证、过期、settlement mode 与当前 capabilities | 回执或聊天陈述不是付款权威。 |
| Discussion | 与订单绑定的买卖双方协调 | 保留有用上下文，但不能只凭消息文本执行受保护状态。 |
| Dispute 与 Evidence | 请求的 remedy、提交材料、履约记录与适用裁决路径 | 保留原始证据，并遵守角色、政策和状态允许的操作。 |

## 订单处理步骤

1. 打开 **Admin → Orders**（`/admin/orders`），选择目标店铺与订单。
2. 核对卖家身份、商品版本、数量、选项、交付义务、总额与买家指示。
3. 检查订单绑定的 Payment Session，并从后端拥有的状态验证资金；不要依赖截图或聊天消息。
4. 只有在库存、政策和履约能力仍有效时才接受或确认。
5. 严格按订单履约，并记录承运商、追踪号、数字交付、服务或其他受支持证据。
6. 分别使用 Discussion、Dispute 与 Evidence；对取消、退款或争议，只执行当前状态与角色允许的操作。
7. 只有已实现的交付与付款 gate 均满足后才完成订单。
8. 按政策保留订单、Quote、付款、履约和沟通引用。

## 预期结果与验证

每个卖家操作都应产生新的权威状态或明确错误，并保留之前可恢复的状态。每次资金或履约状态转换后重新打开订单，核对状态、时间戳、证据以及由此产生的付款操作。

## 失败时

- 收到重复通知时，以订单与事件标识去重，并重新加载当前状态。
- 付款与订单不一致时，停止履约或结算自动化并核对付款引用。
- 履约证据保存失败时，安全保存证据，再通过受支持的转换重试。
- 操作返回 conflict 时，先刷新状态，再判断是否已由另一参与方完成。
- Extension 不健康时，让 Core 资金状态转换 fail closed，并按恢复流程处理。
- Discussion、Payment Session 与 Order summary 不一致时，保留标识并在行动前重载权威订单。

## Agent 边界

Agent 可以总结并准备操作，但没有所需身份、scope、状态、政策与人类确认时，不得确认、退款、结算或完成订单。

- [English canonical page](/sell/orders)
