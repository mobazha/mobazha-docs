---
title: 自行托管的要求与就绪条件
summary: 安装 Mobazha Node 前，确认平台、责任归属、恢复、网络和运营能力。
status: Beta
audiences:
  - 运营者
  - 评估者
evidenceLabel: Node 构建与 standalone 部署源码
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-14
translationOf: self-host/requirements
pageType: policy
outcome: 判断团队能否安全承担主机、网络、恢复、更新与事件响应。
estimatedTime: 10 分钟
journey: operate
primaryAction:
  label: 检查运营基线
  href: /zh/self-host/requirements#当前软件基线
---

## 当前软件基线

| 要求 | 候选版本基线 | 重要性 |
|---|---|---|
| 操作系统 | 受支持的 macOS 或 Linux 环境 | 当前源码构建与服务路径在这些环境验证 |
| Go | 1.26.4 | 与公开构建流程一致 |
| Git | 当前受支持客户端 | 用于记录准确源码版本 |
| 网络 | 评估期间使用 Testnet | 避免把预发布行为视为生产就绪 |
| Listener | 默认 loopback | 保持管理边界私密 |

实际 CPU、内存、存储与带宽需求取决于 Listing、媒体、订单量、数据保留、集成与可用性目标。应测量代表性负载，不要把能启动的最低配置当作生产容量。

## 运营责任

- 明确由谁修补主机、控制管理员访问、监控健康并响应付款或订单事件。
- 定义数据保留、备份频率、恢复测试、恢复目标和异地存储。
- 明确 DNS、TLS、reverse proxy、firewall、RPC、indexer、webhook 与付款服务商负责人。
- 维护能代表生产部署的测试环境。
- 让授权运营者能够取得恢复材料，但不得放入源码控制或日常日志。

## 就绪决定

如果尚不能承担主机安全、备份、监控、更新和事件响应，应先使用托管方式评估。只有控制权与可移植性值得这些责任，且团队能在接受实质交易前证明可恢复时，才选择自行托管。

- [安装 Node](/zh/self-host/install)
- [安全配置](/zh/self-host/configure)
- [备份与升级](/zh/self-host/backup-and-upgrade)
- [English canonical page](/self-host/requirements)
