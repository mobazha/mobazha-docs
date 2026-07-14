---
title: 获取帮助并报告问题
summary: 可复现的产品问题使用公开支持，代码缺陷使用仓库 Issue，安全问题使用私密报告。
status: Current
audiences:
  - 所有人
evidenceLabel: Mobazha 公开支持入口
evidenceUrl: https://mobazha.org/status
reviewed: 2026-07-14
translationOf: support
pageType: hub
outcome: 把产品问题、可复现缺陷、文档问题或安全问题送到正确的公开或私密渠道。
estimatedTime: 3 分钟
journey: community
primaryAction:
  label: 选择支持渠道
  href: /zh/support#选择渠道
---

## 选择渠道

- 在 Mobazha Unified 中打开 Me → Help & Support → Documentation；桌面版 Footer 也链接到同一个权威文档站。
- [文档 Issue](https://github.com/mobazha/mobazha-docs/issues) — 文档过期、缺失、不清晰或互相冲突。
- [Node Issue](https://github.com/mobazha/mobazha/issues) — 可复现的后端、部署、API、支付或运营缺陷。
- [Unified Issue](https://github.com/mobazha/mobazha-unified/issues) — 买家、卖家、浏览器、响应式或前端缺陷。
- [Telegram](https://t.me/MobazhaHQ) — 社群帮助和当前服务问题。
- [Discord](https://discord.gg/3KCPBYxXgb) — 社群讨论和帮助。

## 从故障边界开始

| 症状 | 首先检查 | 可复现时的最佳渠道 |
|---|---|---|
| 托管页面或登录不可用 | [服务状态](https://mobazha.org/status)、浏览器网络结果，以及其他公开页面是否可访问 | 当前服务问题先走社群支持；只有能复现产品缺陷时才提交仓库 Issue |
| 本地 Node 无法启动 | 精确 commit、启动参数、数据目录权限、端口、磁盘和 `doctor --json` | Node Issue |
| 缺少店铺控制项 | runtime-config 就绪状态、能力、当前身份、店铺上下文和卖家配置 | 展示问题走 Unified；后端能力错误走 Node |
| 未观察到付款 | 订单 ID、预期资产、地址、金额、有效期、确认数和依赖健康状态 | 保存脱敏证据后提交 Node Issue；不要盲目再付一笔作为测试 |
| 订单、退款或争议状态异常 | 权威订单状态、付款记录、最近动作和生效政策 | 状态权威错误走 Node；后端正确但前端展示错误才走 Unified |
| Webhook 或集成重复执行 | 投递或事件 ID、签名结果、端点响应和对账记录 | 投递行为走 Node；消费者去重问题由集成维护者处理 |
| 文档与行为冲突 | 页面 URL、审阅日期、部署版本、能力快照和冲突结果 | 文档 Issue |

不要同时改变多个层。先在最小的本地或可丢弃边界复现，再报告拥有错误状态的组件。

## 写出有用的报告

- 说明是托管还是自行托管、精确版本或 commit、操作系统和相关能力状态。
- 提供最小复现步骤、预期行为、实际行为和脱敏证据。
- 搜索已有 Issue，并链接相关文档或发布说明。
- 不得包含 Access Token、私钥、助记词、钱包恢复材料、客户数据或私有基础设施详情。

订单或付款问题只提供关联记录所需的脱敏标识符。明确资金是仅收到指令、已观察、已验证、已结算、已退款还是仍未知；这些状态需要不同的恢复动作。

## 安全问题例外

疑似漏洞、泄露凭据、签名密钥问题和 Exploit 必须使用受影响 GitHub 仓库的私密漏洞报告，不能先发到社群聊天或公开 Issue。

- [English canonical page](/support)
