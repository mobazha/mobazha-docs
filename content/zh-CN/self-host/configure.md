---
title: 配置自行托管的 Node
summary: 明确且可恢复地设置部署模式、数据位置、网络暴露、付款与外部依赖。
status: Beta
audiences:
  - 运营者
evidenceLabel: Mobazha Node 命令与部署源码
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-14
translationOf: self-host/configure
pageType: task
lastTested: 2026-07-04
outcome: 运行一个数据、listener、依赖、备份与回滚负责人都明确的 Node profile。
estimatedTime: 20–40 分钟
journey: operate
primaryAction:
  label: 记录部署 profile
  href: /zh/self-host/configure#开始前
---

## 开始前

学习运营模型时使用专用数据目录与 Testnet。把准确 binary commit、flags、配置与外部依赖和备份程序一起记录。

```text
./mobazha init --testnet --datadir /path/to/mobazha-data
./mobazha start --testnet --datadir /path/to/mobazha-data --open
```

修改不可丢弃的 profile 前先备份，并记录 binary commit、network、data directory、listener、reverse proxy、DNS、certificate、付款依赖与 rollback owner。

## 配置步骤

1. 选择一个明确的数据目录，并把访问限制在 service account。
2. 把管理 listener 保持在 loopback 或受信任私有网络。
3. 只有确需远程管理时，才配置带认证的 TLS reverse proxy。
4. 每次只启用一种付款或 Extension 依赖，并在每次变更后检查健康。
5. 配置备份目的地、监控、日志保留与升级责任。
6. 通过受支持的 service command 重启，并重新运行诊断。

## 安全与依赖检查

- 除非有意配置了带认证 reverse proxy 与 TLS 边界，否则管理接口只绑定受信任网络。
- 只启用 effective runtime capability set 报告、且卖家已配置的付款方式。
- 把 RPC、indexer、webhook、plugin 和远程媒体输入视为不受信任依赖。
- Secret 不进入源码控制；恢复材料与普通服务配置分开。
- 生产使用前，记录 DNS、firewall、proxy、certificate、backup、monitoring 与 rollback 的负责人。

## 预期结果与验证

存在源码文件、可识别标识符、前端组件或配置字段，都不能证明能力已启用。实际可用性是 distribution allowlist、contract compatibility、installation 或 composition、authorization、configuration 与 health 的交集。

```bash
./mobazha service status
./mobazha doctor --json
curl -fsS http://127.0.0.1:5102/v1/runtime-config | jq
```

确认进程使用预定数据目录与网络、本地 UI 可访问、effective capabilities 与已配置依赖一致，并且没有管理接口意外公开。

- [运行时能力](/zh/build/runtime-capabilities)
- [兼容性政策](/zh/project/compatibility)

## 失败时

- 回滚最后一次配置变更，不要同时改变多个变量。
- Node 读取了其他 profile 时，停止服务并核对 service arguments，再写入新数据。
- 远程访问失败时，先重新测试 loopback 健康，再排查 proxy 或 DNS。
- capability 变为不健康时，停止展示新工作，同时保留既有订单的恢复路径。
- 只通过与版本兼容的流程从已验证备份恢复。

- [English canonical page](/self-host/configure)
