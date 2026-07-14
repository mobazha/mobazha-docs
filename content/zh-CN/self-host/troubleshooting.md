---
title: 排查 Mobazha Node 故障
summary: 在不暴露敏感资料的前提下，诊断版本、进程、健康、能力、配置与依赖故障。
status: Beta
audiences:
  - 运营者
  - 支持人员
evidenceLabel: Mobazha Node 运营命令
evidenceUrl: https://github.com/mobazha/mobazha#operations
reviewed: 2026-07-14
translationOf: self-host/troubleshooting
pageType: task
lastTested: 2026-07-04
outcome: 隔离一个故障边界，并在进行恢复变更前保留可复现、已脱敏的测试。
estimatedTime: 10–30 分钟
journey: operate
primaryAction:
  label: 记录初始状态
  href: /zh/self-host/troubleshooting#开始前
---

## 开始前

修改数据、flag、版本或付款配置前，创建或找到当前备份。记录准确症状、首次发生时间、近期变更、版本、平台、network mode 与预定 data directory。

## 诊断步骤

1. 确认 binary version、start flags、data directory、network mode、system time 与可用磁盘空间。
2. 在不暴露 secret 的情况下检查 service status 与 diagnostics。
3. 先测试本地 UI 与 runtime endpoint，再检查外部 DNS、proxy 或浏览器层。
4. 将展示的 runtime capabilities 与失败 operation 对照。
5. 区分 Node 故障与 RPC、indexer、network、payment provider、webhook consumer 或 browser 故障。
6. 复现一条最小失败请求或 UI 旅程，并保留其脱敏标识符。

## 首轮检查

- 确认 binary version、start flags、data directory、network mode 与 system clock。
- 测试外部 DNS 或 proxy 前，先确认本地 UI 与健康端点响应。
- 将展示的 runtime capabilities 与失败 operation 对照。
- 区分 Node、RPC、indexer、network、payment provider、webhook consumer 或 browser 的故障。

```text
./mobazha service status
./mobazha doctor
./mobazha doctor --json
```

| 症状 | 首先检查的边界 | 避免 |
|---|---|---|
| 进程无法启动 | data directory 所有权、port、disk、既有 process | 删除 profile |
| 本地 UI 不可用 | loopback listener 与 process health | 先修改公开 DNS |
| capability 缺失 | runtime snapshot、configuration、dependency health | 启用只存在于前端的 flag |
| 未检测到付款 | order、asset、address、amount、expiry、RPC health | 发送第二笔付款 |
| webhook 延迟 | delivery history、endpoint response、signature handling | 把重复投递当成新状态 |

## 可提供给支持人员的安全证据

- 记录准确 version 或 commit、操作系统、复现步骤、预期结果与脱敏错误。
- 只在不暴露客户资料或 secret 时提供 request、event 或 order 标识符。
- 移除 token、私有 endpoint、seed、key、wallet recovery material、原始客户资料与完整生产数据库。
- 怀疑安全问题时停止公开讨论，使用 private vulnerability reporting。

## 先恢复，再实验

修改数据、flag、版本或付款配置前创建并验证备份。优先采用可复现 rollback，不要反复手工修改店铺唯一数据副本。

```text
./mobazha backup --output mobazha-backup.tar.gz
```

## 预期结果与验证

诊断应找出故障边界与可复现测试，而不是只让症状消失。变更后重新运行诊断与受影响的最小旅程，再确认无关订单和付款路径仍稳定。

## 失败时

- 两次无法解释的重试后停止，并保留原始证据。
- 理解 rollback 时，撤回最后一次已知配置变更。
- 不要编辑 Core order 或 payment table 强制状态转换。
- 安全问题私下升级，运营缺陷通过 Node issue tracker 报告。

## 获取帮助

- [公开支持渠道](/zh/support)
- [Node issues](https://github.com/mobazha/mobazha/issues)
- [English canonical page](/self-host/troubleshooting)
