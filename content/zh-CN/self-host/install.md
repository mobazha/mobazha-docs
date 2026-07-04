---
title: 安装 Mobazha Node
summary: 从公开源码构建候选版本，在本地和测试网启动，并在对外暴露前验证 UI 与运行边界。
status: Beta
audiences:
  - 运营者
  - 开发者
evidenceLabel: Mobazha Node 快速开始
evidenceUrl: https://github.com/mobazha/mobazha#quick-start
reviewed: 2026-07-04
translationOf: self-host/install
pageType: task
lastTested: 2026-07-04
outcome: 从记录过版本的公开源码启动本地测试网 Node，并验证健康边界。
estimatedTime: 15–30 分钟
journey: operate
primaryAction:
  label: 检查开始前条件
  href: /zh/self-host/install#开始前
---

## 开始前

当前候选版本需要 Go 1.26.4、Git，以及受支持的 macOS 或 Linux 环境。先准备专用数据目录，确认磁盘空间、本地防火墙策略、备份位置以及管理员会话由谁控制。付款流程只能先在测试网评估。

- [查看英文详细要求](/self-host/requirements)
- [查看英文发布边界](/project/release-scope)

## 安装步骤

1. 克隆公开 Node 仓库，并记录准备评估的准确 commit。
2. 使用下面的纯 Go 加密实现构建二进制文件。
3. 为服务账号初始化测试网数据目录。
4. 在默认的仅本机监听地址启动 Node，并打开内嵌 UI。
5. 保持终端可见，直到首次启动和健康检查完成。

```text
git clone https://github.com/mobazha/mobazha.git
cd mobazha
go build -tags goolm -o mobazha .
./mobazha init --testnet
./mobazha start --testnet --open
```

> **Important:** 执行前先审阅命令。v0.3 不是稳定生产版本，签名发布制品仍待正式发布。

## 预期结果与验证

- 首次启动会在需要时初始化默认数据目录。
- 内嵌 Web UI 与 HTTP API 默认监听 http://127.0.0.1:5102。
- HTTP 位于 /v1/，WebSocket 位于 /ws，MCP Streamable HTTP 位于 /v1/mcp。
- 保持本地监听；在远程暴露前配置 TLS、认证、防火墙、更新与恢复方案。

在第二个终端运行：

```bash
./mobazha doctor --json
curl -fsS http://127.0.0.1:5102/v1/runtime-config | jq
```

确认诊断能够完成、内嵌 UI 可以打开、运行时快照使用受支持的 schema，并且尚未配置或不健康的可选能力保持不可用。

`doctor --json` 会返回通过、警告和失败数量以及具名检查。路径、容量、版本与可选依赖结果会因主机而异；健康的本地 Node 应有零项失败，警告仍需按目标部署逐项审阅。

```json
{
  "pass": 7,
  "warn": 3,
  "fail": 0,
  "results": [
    {
      "name": "Data directory",
      "status": "PASS",
      "detail": "<data-dir> (database found: <database-path>)"
    },
    {
      "name": "Node API",
      "status": "PASS",
      "detail": "healthy"
    }
  ]
}
```

这里的列表经过缩短，只展示输出契约形状。运维时保留完整本地结果；公开分享前必须移除路径和环境细节。

## 可选后台服务

完成交互式启动验证后，再安装并检查受支持的后台服务。

```text
./mobazha service install
./mobazha service status
./mobazha doctor --json
```

## 失败时恢复

- 构建失败时，确认 `go version`、检出的 commit、平台工具链和可用存储空间。
- 启动失败时，保留脱敏诊断，并确认数据目录所有权和端口占用。
- UI 无法打开时，先测试本地监听，不要直接修改 DNS、TLS 或防火墙。
- 运行时能力未就绪时，检查配置和依赖，不要手动强制开启前端入口。
- 只能删除明确创建的可丢弃测试目录；不要为了重试安装而删除店铺的唯一数据副本。

## 继续

- [部署源码](https://github.com/mobazha/mobazha/tree/main/deploy/standalone)
- [English canonical page](/self-host/install)
