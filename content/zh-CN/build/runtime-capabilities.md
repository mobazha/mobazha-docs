---
title: 运行时能力与产品组合
summary: 从后端发现有效行为，并把部署方式、产品体验、能力、权限和实验开关分开处理。
status: Beta
audiences:
  - 开发者
  - Agent 开发者
  - 运营者
sourceLabel: Mobazha 兼容性与 Unified 运行时契约
sourceUrl: https://github.com/mobazha/mobazha-unified/blob/main/docs/architecture/RUNTIME_CAPABILITIES.md
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

## 权威文档

- [Node 兼容性政策](https://github.com/mobazha/mobazha/blob/main/docs/project/COMPATIBILITY.md)
- [Unified 运行时组合](https://github.com/mobazha/mobazha-unified/blob/main/docs/architecture/RUNTIME_CAPABILITIES.md)
- [English canonical page](/build/runtime-capabilities)
