---
title: 基于后端声明的能力构建
summary: 集成应主动发现后端支持什么，不能假设每个 Mobazha 部署都公开相同接口。
status: Beta
audiences:
  - 开发者
  - Agent 构建者
evidenceLabel: Mobazha 公开源码组织
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-14
translationOf: build
pageType: hub
outcome: 为集成选择当前公开契约，并在不假设部署完全相同的前提下完成第一个有范围限制的调用。
estimatedTime: 5 分钟
journey: build
primaryAction:
  label: 完成第一个 API 调用
  href: /zh/build/quickstart
---

## 集成规则

把连接后端的能力响应和版本信息作为运行时事实。文档解释接口和意图，但客户端必须处理能力不可用、被禁用或版本不同的情况。

## 接口类型

- 用于交易操作和实时更新的 HTTP 与 WebSocket 接口。
- 面向运营者控制的事件投递 Webhook。
- 带明确身份和授权边界的 MCP 与 Agent 接口。
- 只有连接部署明确声明时才可使用的插件和契约。

> **Important:** 当前 Node 的 HTTP 入口位于 `/v1/`，WebSocket 位于 `/ws`，MCP Streamable HTTP 位于 `/v1/mcp`。具体操作仍取决于版本和能力。

## 开始构建

- [选择接口和集成契约](/zh/project/surfaces-and-integrations) — 区分客户端壳、上下文路由、传输、事件和状态权威。
- [完成第一个认证 API 调用](/zh/build/quickstart) — 发现能力并调用受保护的读取操作。
- [认证与 Scope](/zh/build/authentication) — 在 Basic、托管 JWT 和有 Scope 的 API Token 中选择。
- [错误、重试和幂等](/zh/build/errors-and-idempotency) — 在结果未知时保持业务正确性。
- [HTTP API 与 OpenAPI](/zh/build/api) — 使用生成的 operation 和 Schema 契约。
- [Webhook](/zh/build/webhooks) — 验证签名、去重并对账。
- [WebSocket](/zh/build/websocket) — 把事件当成刷新提示，而不是最终事实。
- [MCP 与 Agent](/zh/build/mcp) — 初始化有 Scope 的 Streamable HTTP 客户端。

- [English canonical page](/build)
