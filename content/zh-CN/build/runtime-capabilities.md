---
title: 运行时能力与产品组合
summary: 从后端发现有效行为，并把部署方式、产品体验、能力、权限和实验开关分开处理。
status: Beta
audiences:
  - 开发者
  - Agent 开发者
  - 运营者
evidenceLabel: Unified 运行时配置实现
evidenceUrl: https://github.com/mobazha/mobazha-unified/tree/main/packages/core/config
reviewed: 2026-07-04
translationOf: build/runtime-capabilities
---

## 有效能力交集

所有门槛都通过后，能力才能对外公开和使用。源码存在、标识符被识别、前端有组件或配置中出现名称，都不代表能力已启用。

```text
发布允许列表
  ∩ 契约兼容
  ∩ 已安装或静态组合
  ∩ 已授权
  ∩ 已配置
  ∩ 健康
```

## 客户端必须失败关闭

- 在权威能力快照就绪前，不渲染或调用可选功能。
- 允许未知的新增字段，但对畸形或不兼容版本安全拒绝。
- 导航、路由、操作控件和 Agent 工具使用同一能力键。
- 客户端隐藏控件不能代替服务端授权。

## 产品组合维度

- 认证模式只选择认证传输方式，不启用产品能力。
- 部署方式描述托管、自托管或自主运行。
- 产品体验选择平台、商店或市场外壳。
- 能力描述后端实际实现的产品行为。
- 权限描述当前主体可以做什么。
- 功能开关只用于实验或紧急关闭，不能替代授权。

## 实现证据

- [兼容性政策](/project/compatibility)
- [Unified 运行时配置代码](https://github.com/mobazha/mobazha-unified/tree/main/packages/core/config)
- [English canonical page](/build/runtime-capabilities)
