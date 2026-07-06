---
title: 运营进入店铺的订单
summary: 对账付款、确认义务、记录履约证据，并只执行当前状态允许的取消、退款、争议和完成动作。
status: Beta
audiences:
  - 卖家
  - 运营者
  - Agent
evidenceLabel: Unified 订单管理与 Node 订单状态契约
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/orders
reviewed: 2026-07-06
translationOf: sell/orders
pageType: task
lastTested: 2026-07-04
outcome: 使用当前状态允许的动作，把一笔已付款订单安全推进到履约结果。
estimatedTime: 每次检查约 5 分钟
journey: use
primaryAction:
  label: 检查进入店铺的订单
  href: /zh/sell/orders#开始前
---

## 开始前

- 在接受订单前公开履约、退款和争议政策。
- 监控后端、支付依赖、库存和买家沟通。
- 把通知、聊天声明、Payment Session 与订单权威状态分开理解。

## 订单工作区包含四类相互连接的记录

卖家从 `/admin/orders` 进入订单，详情位于 `/orders/{orderId}`，并可分别呈现 Summary、Discussion、Dispute 和 Evidence。

| 记录 | 用途 | 权威规则 |
|---|---|---|
| Summary | 已接受商品快照、双方、金额、配送义务、当前状态和可用动作 | 每个有后果的转换后重新加载。 |
| Payment Session | 资金目标、观察、验证、有效期、结算模式与能力 | 回执或聊天声明不是支付权威。 |
| Discussion | 与订单绑定的买卖双方协调 | 保留上下文，但不能让消息文字直接改变受保护状态。 |
| Dispute / Evidence | 请求的补救、材料、履约记录和适用决定路径 | 保留原始证据并遵循角色、政策和状态允许的动作。 |

## 订单处理步骤

1. 打开 **Admin → Orders**（`/admin/orders`），选择正确店铺与订单。
2. 核对卖家身份、Listing revision、数量、规格、配送义务、总额和买家要求。
3. 检查订单绑定的 Payment Session，只根据后端状态确认资金。
4. 库存、政策和履约能力仍有效时才接受订单。
5. 履约准确的订单，并记录承运商、追踪、数字交付、服务或其他支持证据。
6. 分别使用 Discussion、Dispute 与 Evidence；只执行当前角色和状态允许的取消、退款或争议动作。
7. 只有实现的交付与支付门槛满足后才完成订单。
8. 根据政策保留订单、Quote、支付、履约和沟通引用。

## 预期结果与验证

每个卖家动作都应产生新的权威状态，或返回清晰错误并保留之前的可恢复状态。每次财务或履约转换后重新打开订单，核对状态、时间、证据、Payment Session 与后续动作。

## 失败与恢复

- 重复通知：按订单与事件标识去重，然后重新加载当前状态。
- 付款与订单不一致：停止履约或结算自动化并对账支付引用。
- 履约证据保存失败：安全保存原始材料并通过支持的转换重试。
- 动作冲突：先刷新，确认是否已有其他角色完成转换。
- Summary、Discussion 与 Payment Session 不一致：保留标识并以权威订单重新核对。

## Agent 边界与继续

Agent 可以总结和准备动作，但不能绕过身份、权限、状态、政策和所需确认去接受、退款、结算或完成订单。

- [取消、退款或争议](/zh/buy/cancel-refund-dispute)
- [English canonical page](/sell/orders)
