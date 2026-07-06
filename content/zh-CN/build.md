---
title: 基于后端实际公开的能力进行开发
summary: 集成应发现当前后端支持什么，而不是假设每种 Mobazha 部署都公开相同能力。
status: Beta
audiences:
  - 开发者
  - Agent 开发者
evidenceLabel: Mobazha 公开源码组织
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-04
translationOf: build
pageType: hub
outcome: 选择当前可用的公共集成契约，并在不假设所有部署相同的前提下开始开发。
estimatedTime: 5 分钟
journey: build
primaryAction:
  label: 查看公开界面
  href: /zh/build#公开界面
---

## 集成原则

把连接后端的版本与有效能力响应作为运行时事实。文档描述接口与意图，但客户端必须处理能力不可用、被关闭或版本不同的情况。

## 公开界面

- 版本化 HTTP API 与 WebSocket 实时事件。
- 面向运营者的 Webhook 事件投递。
- 带身份、ai:use 和工具级权限边界的 MCP。
- 只有部署实际声明时才可使用的扩展和合约。

## 继续

- [选择交互表面与集成契约](/zh/project/surfaces-and-integrations)
- [运行时能力](/zh/build/runtime-capabilities)
- [OpenAPI](/openapi.json)
- [English canonical page](/build)
