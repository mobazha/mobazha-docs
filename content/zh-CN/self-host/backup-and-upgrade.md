---
title: 安全备份与升级
summary: 把升级就绪当作可恢复性演练，而不只是更新软件包。
status: Beta
audiences:
  - 运营者
evidenceLabel: Mobazha 运营指南
evidenceUrl: https://github.com/mobazha/mobazha/tree/main/docs/releases
reviewed: 2026-07-14
translationOf: self-host/backup-and-upgrade
pageType: task
lastTested: 2026-07-04
outcome: 生成经过验证的备份，并升级一个已审核版本，同时保留可恢复的回滚点。
estimatedTime: 30–60 分钟
journey: operate
primaryAction:
  label: 准备恢复点
  href: /zh/self-host/backup-and-upgrade#开始前
---

## 开始前

- 阅读 release notes，识别 schema、付款、capability 与配置变更。
- 创建带版本信息的备份，并确认其可读取。
- 记录运行版本与配置；单独保护 secret。
- 变更生产环境前，规划 rollback 与维护窗口。
- 升级后验证健康、店铺访问、订单流程与付款 callback。

> **Warning:** 备份文件只有在隔离环境中按兼容版本流程检查并恢复过，才构成恢复计划。

## 备份与升级步骤

1. 记录运行 binary version 或 commit、service arguments、data directory、配置与 effective capabilities。
2. 阅读 Node 与客户端 release notes，识别 migration、已移除 flag、付款变更与 compatibility requirement。
3. 运行诊断；升级前解决既有损坏、存储或依赖故障。
4. 按 release procedure 停止或静止写入，并创建带时间戳的备份。
5. 把备份与必要恢复材料复制到独立保护的位置。
6. 在隔离环境中，用代表性数据测试新版本。
7. 安排维护窗口，安装已审核 artifact 并启动服务。
8. 验证诊断、Storefront、管理、订单读取、付款观察、webhook 投递与备份创建。

## 内置命令

版本变更前运行诊断并创建压缩备份。

```text
./mobazha doctor --json
./mobazha backup --output mobazha-backup.tar.gz
```

备份命令会报告解析后的来源与输出路径，最后报告 archive 大小；路径和大小取决于部署。

```text
Backing up <data-dir> → <absolute-output-path>/mobazha-backup.tar.gz
Backup complete: <absolute-output-path>/mobazha-backup.tar.gz (<size> MB)
```

## 预期结果与验证

备份命令应无错误完成，并在指定路径生成非空 archive。记录大小、创建时间、来源版本与 cryptographic checksum。即使 archive 内的数据已加密，也要用独立访问政策保护 secret 与恢复材料。

升级后比较 effective capabilities，并完成一条小额 Testnet 旅程。不能只凭进程健康宣告成功。

## 恢复与回滚

当前候选版本没有为所有历史版本发布通用的一键恢复承诺。使用 release-specific migration 与 restore 指南，保留原始备份，并先在独立数据目录练习。只有旧 binary 支持升级后的数据格式时才可 rollback。

- 升级后启动失败时，停止反复写入并保留日志与升级后的数据副本。
- migration 为单向时，恢复升级前备份，不要用旧 binary 打开已迁移数据。
- 订单或付款不一致时，让资金自动化 fail closed，同时进行 reconciliation。
- 缺少恢复说明应作为 release blocker 报告，而不是由运营者在生产环境临时发挥。

- [English canonical page](/self-host/backup-and-upgrade)
