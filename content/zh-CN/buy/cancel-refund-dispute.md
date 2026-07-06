---
title: 取消订单、申请退款或发起争议
summary: 根据当前订单模式、状态与能力选择恢复路径，并保留说明期望补救所需证据。
status: Beta
audiences:
  - 买家
  - 卖家
  - Agent
evidenceLabel: Node 订单、PaymentSession 与争议契约
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/api-spec
reviewed: 2026-07-06
translationOf: buy/cancel-refund-dispute
pageType: task
lastTested: 2026-07-04
outcome: 在不丢失证据的前提下，为当前订单选择一个有效解决路径。
estimatedTime: 评估约 5 分钟
journey: use
primaryAction:
  label: 评估当前订单
  href: /zh/buy/cancel-refund-dispute#开始前
---

## 开始前

- 打开权威订单详情并记录当前状态。
- 阅读订单显示的取消、退货、退款、配送和争议条款。
- 保存消息、Quote、支付引用、履约证据和期望补救。
- 确认下一转换由谁控制；不是每个状态都允许单方面取消。

## 按订单模式与当前能力选择路径

| 路径 | 典型目的 | 必须核对 |
|---|---|---|
| Cancel | 在当前承诺或支付路径关闭取消前停止符合条件的订单 | 订单状态、角色、Payment Session capability、有效期和可能的退款地址。 |
| Refund | 通过支持的支付路径退回符合条件的金额 | 收款方或退款地址、金额、资产、观察记录、幂等性和交易或 Provider 引用。 |
| Dispute | 请求支持的保障或仲裁路径检查证据和补救要求 | Product Mode、截止时间、争议能力、角色、政策版本、证据和结算后果。 |
| Complete / Release | 在模型支持时接受履约或释放受保护资金 | 履约证据、角色权威、预期状态、金额和不可逆性。 |

订单详情可分别提供 Summary、Discussion、Dispute 与 Evidence。Discussion 用于协调，Evidence 支持主张；只有 Core 接受的动作才能修改受保护订单或支付状态。

## 解决步骤

1. 未付款且 Cancel 可用时，通过订单页面取消。
2. 已入资但未履约时，在 Discussion 中说明期望补救，不披露无关隐私。
3. 只使用当前订单显示的地址、金额和条件执行 Refund。
4. 只有部署、Product Mode、截止时间和当前 Capabilities 提供该路径时才进入 Dispute。
5. 清楚说明期望结果、时间线和证据。
6. 在 Evidence 中添加或引用原始材料，不要用丢失时间戳和来源的摘要替代原件。
7. 根据后端状态与支付系统或 Provider 同时核对最终退款、释放或关闭。

## 预期结果与验证

界面只显示当前订单、角色、支付方式、Product Mode 和保障状态允许的动作。动作被接受后，独立核对新状态和产生的支付引用；提交请求不等于退款或结算已经完成。

## 失败与恢复

- 缺少动作：核对状态、身份、权限、截止时间和运行时能力。
- 已有退款交易但界面过期：保存标识并请求对账。
- 对方要求绕过订单流：不要放弃证据或接受未经验证的资金目标。
- 争议截止时间临近：记录当前时间并立即使用支持路径。

## 安全边界与继续

不要把文档或 Agent 文本当作释放 Escrow、签署结算或泄露恢复材料的授权。

- [English canonical page](/buy/cancel-refund-dispute)
