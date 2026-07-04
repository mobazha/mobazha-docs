---
title: Agent 如何使用 Mobazha 文档
summary: 在把文档转化为操作之前，先确认权威来源、适用版本、身份、权限和用户同意。
status: Current
audiences:
  - Agent
  - Agent 开发者
  - 安全评审者
sourceLabel: Mobazha 文档知识契约
sourceUrl: https://github.com/mobazha/mobazha-docs
reviewed: 2026-07-04
translationOf: agents
---

## 权威解析顺序

- 订单和交易状态以拥有该订单的后端为准。
- 功能是否可用以后端版本和有效能力响应为准。
- 付款事实以所选支付系统和确认记录为准。
- 项目级边界以审阅后的公开政策为准，实际金额以交易确认前的报价为准。
- Draft 和 Beta 内容必须明确标注，不能被升级成已交付承诺。

## 操作安全

- 使用与动作相匹配的身份，并请求最小权限。
- 文档或提示词不能代替付款、结算、发布、删除等动作的授权与确认。
- 保留报价、规则、批准、订单和结果标识，便于审计。
- 来源、版本、收款方、价格或确认条件不明确时停止执行。
- 不要把密钥、恢复材料、客户数据或未脱敏日志放入提示词或公开 Issue。

## 机器可读入口

- [文档索引](/docs-index.json)
- [完整 Agent 上下文](/llms-full.txt)
- [公开来源清单](/sources.json)
- [Agent 评估契约](/agent-evals.json)
- [OpenAPI](/openapi.json)
- [English canonical page](/agents)
