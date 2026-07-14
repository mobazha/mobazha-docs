---
title: 设计网络与 TLS 边界
summary: 默认保持 Node 管理私密，只公开明确经过认证、加密并受监控的路由。
status: Beta
audiences:
  - 运营者
  - 安全审核者
evidenceLabel: Node listener 与 API 表面
evidenceUrl: https://github.com/mobazha/mobazha
reviewed: 2026-07-14
translationOf: self-host/network-and-tls
pageType: concept
outcome: 选择一个保持管理私密、且只明确公开已认证路由的网络边界。
estimatedTime: 7 分钟
journey: operate
primaryAction:
  label: 查看建议边界
  href: /zh/self-host/network-and-tls#建议边界
---

## 建议边界

```text
public client
  -> TLS reverse proxy or trusted private network
  -> authenticated allowed routes
  -> Node on loopback or a private interface
```

不要把默认管理 listener 直接暴露到互联网。Reverse proxy 不会让未认证路由自动安全；必须保留 Node authentication、request limits、body limits、timeouts、WebSocket upgrade handling 与 security headers。

## 路由注意事项

| 表面 | 默认路径 | 边界 |
|---|---|---|
| Embedded UI 与 HTTP API | `http://127.0.0.1:5102`，API 位于 `/v1/` | 不同 operation 的管理与商业授权要求不同 |
| WebSocket | `/ws` | 认证连接，并保留重连限制 |
| MCP Streamable HTTP | `/v1/mcp` | 要求 gateway identity、`ai:use` 与 tool scopes |
| Webhooks | 从 Node 向外发送 | 验证 destination、TLS、signature、timeout 与 retry 行为 |

## 暴露检查

- 使用受维护配置终止 TLS，并安全自动更新 certificate。
- 把 Node 绑定到 loopback 或私有接口，限制主机 firewall ingress。
- 只通过受信任 proxy headers 转发原始 scheme 与 host。
- 设置 rate、connection、request-size 与 timeout 限制，同时不破坏 WebSocket 或 MCP streaming。
- 把公开 Storefront 与管理员、token minting、wallet 和 system operation 分离。
- 监控认证失败与意外路由暴露。

## 验证

从受信任边界外枚举时，只应看到有意公开的路由，且管理操作会拒绝未认证请求。从内部验证部署需要的 UI、API、WebSocket 与 MCP 路径。每次 proxy 或 certificate 变更后重新测试。

- [English canonical page](/self-host/network-and-tls)
