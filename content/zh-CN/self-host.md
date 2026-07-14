---
title: 在自己控制下运行 Mobazha Node
summary: 评估要求，在测试网安装，定义网络边界，监控健康状态，并在生产使用前准备恢复路径。
status: Beta
audiences:
  - 运营者
  - 开发者
evidenceLabel: Mobazha 部署源码
evidenceUrl: https://github.com/mobazha/mobazha/tree/main
reviewed: 2026-07-14
translationOf: self-host
pageType: hub
outcome: 判断自行托管是否合适，并获得健康且可恢复的评估 Node。
estimatedTime: 6 分钟
journey: operate
primaryAction:
  label: 检查要求
  href: /zh/self-host/requirements
featuredVisual: self-host-trust-boundary
---

## 选择运营路径

- [检查主机和发布要求](/zh/self-host/requirements)
- [安装评估 Node](/zh/self-host/install)
- [配置 Node](/zh/self-host/configure)
- [设置网络与 TLS 边界](/zh/self-host/network-and-tls)
- [增加监控和健康检查](/zh/self-host/monitoring)
- [备份、升级与恢复](/zh/self-host/backup-and-upgrade)
- [应用安全模型](/zh/self-host/security)
- [诊断 Node](/zh/self-host/troubleshooting)

## 评估版快速开始

当前候选版本需要 Go 1.26.4、Git，以及受支持的 macOS 或 Linux 环境。评估付款流程时使用测试网。

```text
git clone --branch main https://github.com/mobazha/mobazha.git
cd mobazha
go build -tags goolm -o mobazha .
./mobazha init --testnet
./mobazha start --testnet --open
```

> **Important:** v0.3 用于评估和测试网。稳定二进制文件及签名发布制品尚未发布。

## 就绪的评估 Node 应有什么证据

| 边界 | 应保留的证据 |
|---|---|
| 构建与身份 | 精确源码提交、构建命令、版本、服务账号、网络和数据目录 |
| 本地健康 | 成功的服务状态、`doctor --json`、内嵌 UI 和 runtime-config 检查 |
| 网络暴露 | 符合预期的监听、Firewall、Proxy、DNS 和 TLS，且没有意外公开管理员入口 |
| 交易 | 在支持的测试网轨道上完成一次可丢弃的商品、报价、付款观察、履约和恢复流程 |
| 恢复 | 带时间戳的备份，以及使用兼容构建完成的隔离恢复测试 |
| 运维 | 明确的告警接收者、更新负责人、回滚负责人，以及存储、依赖和付款故障的安全首要动作 |

进程启动只是第一个证明。如果唯一店铺副本仍在运行主机上、能力只是从源码推测，或者没人负责告警与回滚，Node 就还没有达到运维就绪。

## 运营者责任

- 保护主机、管理员访问、秘密和网络边界。
- 在升级前备份数据和恢复材料。
- 监控存储、可用性、付款集成和发布说明。
- 只公开用户和 Agent 实际需要的接口。

## 运营循环

1. **接受工作前：** 确认健康、存储、备份时效、有效能力，以及外部支付或配送依赖。
2. **事故期间：** 停止宣传不可用的新工作，保留现有订单证据，隔离故障边界后再重试。
3. **升级前：** 阅读发布证据，创建并测试恢复点，明确维护窗口和回滚判断。
4. **变更后：** 验证诊断结果，以及受影响的一条代表性买家、卖家、付款、Webhook 和恢复路径。

- [监控 Node](/zh/self-host/monitoring)
- [安全备份和升级](/zh/self-host/backup-and-upgrade)
- [不破坏证据地排障](/zh/self-host/troubleshooting)

## 可选托管连接

在服务提供时，运营者可以把自托管 Node 绑定到可选 Mobazha 账号以使用托管能力。绑定不会转移本地恢复材料的保管权，也不是独立运行的必要条件。

- [连接可选托管账号](/zh/self-host/bind-account)
- [English canonical page](/self-host)
