---
title: 监控自行托管的 Node
summary: 在进程、存储、能力、付款、webhook 或恢复退化演变为订单事件前发现问题。
status: Beta
audiences:
  - 运营者
evidenceLabel: Node 诊断与运营源码
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-14
translationOf: self-host/monitoring
pageType: task
lastTested: 2026-07-04
outcome: 在进程、存储、能力和依赖退化演变为订单事件前发现问题。
estimatedTime: 20–40 分钟
journey: operate
primaryAction:
  label: 定义告警边界
  href: /zh/self-host/monitoring#开始前
---

## 开始前

- 明确谁接收告警、谁可以采取修正操作。
- 将监控凭据与 Node 管理员、签名凭据分开。
- 定义预期可用性、备份时效、磁盘余量与付款依赖健康标准。

## 监控设置步骤

1. 从受信任本地 monitor 定期运行 `mobazha service status` 与 `mobazha doctor --json`。
2. 监控进程重启、磁盘空间、文件系统错误、系统时间与备份时效。
3. 轮询 runtime capability snapshot，并在 readiness 或付款方式意外变化时告警。
4. 将 RPC、indexer、webhook 与外部服务商的延迟和失败，与 Node 健康分开监控。
5. 追踪认证失败、重复 permission error、webhook dead letter 与订单 reconciliation failure。
6. 测试告警发送，并为每类告警记录第一个安全响应。

```bash
./mobazha service status
./mobazha doctor --json
curl -fsS http://127.0.0.1:5102/v1/runtime-config | jq
```

## 预期结果与验证

监控应能区分进程不可用、依赖退化、能力被拒绝和业务操作失败。在非生产环境触发可控失败，确认告警能指出正确边界，同时不记录 secret 或客户 payload。

## 失败时

- 监控失去访问时，不要削弱 Node authentication；修复范围最窄的监控凭据或本地执行路径。
- capability 变为不健康时，停止展示新工作，同时保留既有订单恢复。
- 磁盘或备份告警触发时，先保护当前数据，再重启或升级。
- 告警含有 secret 或个人资料时，按事件处理并轮换受影响凭据。

- [English canonical page](/self-host/monitoring)
