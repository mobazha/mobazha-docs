---
title: 安装 Mobazha Node
summary: 从公开源码构建候选版本，在本地和测试网启动，并在对外暴露前验证 UI 与运行边界。
status: Beta
audiences:
  - 运营者
  - 开发者
sourceLabel: Mobazha Node 快速开始
sourceUrl: https://github.com/mobazha/mobazha#quick-start
reviewed: 2026-07-04
translationOf: self-host/install
---

## 源码构建路径

当前候选版本需要 Go 1.26.4、Git，以及受支持的 macOS 或 Linux 环境。使用纯 Go 加密实现构建，并先在测试网评估付款流程。

```text
git clone https://github.com/mobazha/mobazha.git
cd mobazha
go build -tags goolm -o mobazha .
./mobazha init --testnet
./mobazha start --testnet --open
```

> **Important:** 执行前先审阅命令。v0.3 不是稳定生产版本，签名发布制品仍待正式发布。

## 启动后的默认边界

- 首次启动会在需要时初始化默认数据目录。
- 内嵌 Web UI 与 HTTP API 默认监听 http://127.0.0.1:5102。
- HTTP 位于 /v1/，WebSocket 位于 /ws，MCP Streamable HTTP 位于 /v1/mcp。
- 保持本地监听；在远程暴露前配置 TLS、认证、防火墙、更新与恢复方案。

## 后台服务与诊断

```text
./mobazha service install
./mobazha service status
./mobazha doctor --json
```

## 继续

- [部署源码](https://github.com/mobazha/mobazha/tree/main/deploy/standalone)
- [English canonical page](/self-host/install)
