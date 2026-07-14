---
title: 为销售准备付款方式
summary: 只展示 distribution 允许、已配置、健康，并由店铺后端持续监控的付款方式。
status: Beta
audiences:
  - 卖家
  - 运营者
evidenceLabel: Node 付款能力与 Unified 付款管理
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/apps/web/src/app/admin/payments
reviewed: 2026-07-14
translationOf: sell/payments
pageType: task
lastTested: 2026-07-13
outcome: 只有在配置、健康、观察和恢复路径都得到验证后，才启用一种付款方式。
estimatedTime: 20–40 分钟
journey: use
primaryAction:
  label: 开始付款就绪检查
  href: /zh/sell/payments#开始前
---

## 开始前

- 评估候选版本时使用测试网与可丢弃订单。
- 确认该方式被 distribution 允许，并由后端实现。
- 了解密钥托管、观察、确认、退款路径、费用与外部依赖。
- 备份恢复材料；绝不要把 seed 或私钥输入文档、聊天或无关服务商表单。

## 把付款就绪理解为会话，而不是一个标志

订单详情通过 `/v1/orders/{orderID}/payment-session` 解析 Payment Session。付款方式标志或 Admin 开关不能替代下列与订单绑定的事实：

| Payment Session 字段 | 回答的问题 |
|---|---|
| `paymentCoin` | 预期使用哪个 canonical 加密资产，或哪个法币服务商/币种？ |
| `settlementMode` | 是地址监控、服务商 Checkout、escrow，还是其他受支持结算路径？ |
| `productMode` | 订单是 direct、cancelable，还是 moderated？ |
| `fundingTarget` | 当前适用的准确地址或服务商会话、金额、资产、memo 与 QR payload 是什么？ |
| `paymentProgress` | 已观察到什么、还差多少、有多少 observation，当前 funding 状态是什么？ |
| `expiresAt` | 何时必须刷新指示，而不能继续复用目标？ |
| `capabilities` | 当前允许 refresh、cancel、confirm、refund 或 completion 中的哪些操作？ |
| `userActionRequest` | 还需要用户明确执行哪个钱包或服务商操作？ |

不要把**付款就绪**、**资金观察**、**验证**与**结算**合并成一个状态；它们回答不同的运营问题。

## 付款就绪步骤

1. 打开 **Admin → Payments**（`/admin/payments`），检查收款账户、服务商、Guest Checkout 政策，以及后端报告为就绪的付款方式。
2. 选择一种方式，只完成其文档列出的设置要求。
3. 验证配置与健康状态，不要只依赖前端开关。
4. 按该付款方式设置或复核确认与付款过期行为。
5. 创建小额测试网订单，将显示的 Payment Session ID、订单 ID、canonical asset、settlement mode、funding target、预期金额与 expiry 和后端状态逐项对照。
6. 广播或授权测试付款，并区分 observed progress 与后端拥有的 funded 状态。
7. 重新打开订单详情，确认 capabilities 只提供当前状态有效的操作。
8. 接受实质订单前，演练适用的取消或退款路径。

对于 attempt-scoped 的标准加密货币付款，只有在必要的卖家与 moderator offer、冻结的结算条款和授权 bundle 一致后，funding target 才可操作。如果 Affiliate attribution 或其他订单特性不被该确切路径支持，后端必须在创建 Draft 前保持路径不可用；前端不能只凭 coin 或 rail 推断支持。

## 预期结果与验证

只有完整的 effective-capability 交集就绪时，该方式才应出现在 Checkout。付款观察必须绑定预期订单、资产、地址、金额、预期状态与确认政策；识别到代码或安装了 adapter 并不足够。

## 失败时

- 设置不完整时保持方式不可用，不要静默降级。
- 健康状态未知时停止展示新的 Checkout 工作，同时保留既有恢复路径。
- 观察到错误金额或目的地的付款时，不要自动结算。
- 会话显示 `awaiting_seller_receipt` 时，不要描述为买家付款延迟；此时卖家侧 funding target 尚未就绪。
- 不要让买家向废弃或不兼容 attempt 留下的地址付款；刷新 Payment Session，只使用当前可操作目标。
- 服务商 Checkout 或钱包操作失败时，重试前保留订单与 Payment Session 标识符。
- 退款路径不可用时，在接受该付款方式前披露限制。

## 当前发布边界

公开客户端与后端包含多种付款 adapter 和兼容路径，但实际可用性由 distribution 政策、后端实现、店铺配置、健康状态、订单模式和 Payment Session capabilities 在运行时共同决定。Token 标识符或源码模块不会创造发布承诺。参见[英文发布范围](/project/release-scope)与[收费与经济模式](/zh/project/fees)。

只有当服务商路径能让卖家出款保持 pending（或保留等价的可逆资金状态），并支持所需恢复操作时，provider-session payment 才能提供 moderated product mode。服务商自己的付款争议或 chargeback 流程，与 Mobazha moderator 的订单决定仍是两件事。

- [English canonical page](/sell/payments)
