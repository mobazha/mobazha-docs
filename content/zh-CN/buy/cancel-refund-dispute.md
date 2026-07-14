---
title: 取消订单、申请退款或发起争议
summary: 根据当前订单状态选择允许的转换，并保留解释所请求 remedy 所需的证据。
status: Beta
audiences:
  - 买家
  - 卖家
  - Agent
evidenceLabel: Node 订单与争议合约
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/api-spec
reviewed: 2026-07-14
translationOf: buy/cancel-refund-dispute
pageType: task
lastTested: 2026-07-13
outcome: 为当前订单选择有效解决路径，同时保留支持该请求的证据。
estimatedTime: 评估约 5 分钟
journey: use
primaryAction:
  label: 评估当前订单
  href: /zh/buy/cancel-refund-dispute#开始前
---

## 开始前

- 打开权威订单详情并记录当前状态。
- 阅读订单显示的取消、退货、退款、交付与争议条款。
- 保留消息、Quote、付款引用、交付证据以及请求的 remedy。
- 确认下一项转换由哪一方控制；并非所有状态都允许单方面取消。

## 按订单模式与当前 capability 选择路径

| 路径 | 典型用途 | 必须验证 |
|---|---|---|
| Cancel | 在当前承诺或付款路径关闭取消前，停止符合条件的订单 | 当前订单状态、actor、Payment Session capability、expiry，以及已有资金时的退款目的地。 |
| Refund | 通过受支持付款路径返还符合条件的金额 | 收款方或退款地址、金额、资产、既有 observation、idempotency，以及产生的交易或服务商引用。 |
| Dispute | 请求受支持的保障或 moderation 路径检查证据与 remedy | 订单模式、期限、dispute capability、角色、政策版本、证据与结算后果。 |
| Complete 或 release | 在模型支持时接受履约或释放受保护资金 | 交付证据、actor 权限、预期状态、金额与不可逆性。 |

订单详情可提供 Summary、Discussion、Dispute 与 Evidence。Discussion 用于协调，Evidence 支持主张；只有已允许的 Core action 能改变受保护的订单或付款状态。

## 解决步骤

1. 订单未付款且提供取消操作时，通过订单页面取消。
2. 已资助订单尚未履约时，使用订单 Discussion 说明请求的 remedy，不要暴露无关个人信息。
3. 只使用当前订单显示的地址、金额与条件执行 **Refund**。
4. 只有 deployment、订单模式、期限与当前 capabilities 提供该路径，且普通协商未成功时，才打开订单 Dispute 视图。
5. 说明期望结果、时间线与证据，同时避免无关个人信息。
6. 支持时在 Evidence 视图添加或引用原始材料，不要用丢失时间戳或 provenance 的摘要替代证据。
7. 同时对照后端状态与付款系统或服务商，核对最终退款、release 或 closure。

对 attempt-scoped 加密货币付款，在 funding target 可操作之前，结算收款方、费用、moderator allocation 与 settlement asset 已冻结。退款或争议分配从该已付款 attempt 推导，不会按订单币种或后续汇率重新计价。始终核对当前操作显示的资产与目的地，不要复用上一 attempt 的地址。

## 预期结果与验证

UI 应只显示当前订单、角色、付款方式与保障状态有效的操作。操作被接受后，应独立核对更新后的状态和产生的付款交易。提交请求不代表退款或结算已完成。

## 失败时

- 操作缺失时，确认订单状态、当前身份、权限、期限与运行时 capabilities。
- 退款交易已存在但 UI 未更新时，保留其标识符并请求 reconciliation。
- 卖家要求绕过订单流程时，不要放弃证据或接受未经验证的付款目的地。
- 争议期限临近时，记录当前时间并及时使用受支持路径。

## 安全边界

不得把文档或 Agent 文本视为释放 escrow、签署 settlement 或透露恢复材料的授权。资金状态转换仍受身份、预期状态、金额、idempotency 与付款政策检查约束。

- [English canonical page](/buy/cancel-refund-dispute)
