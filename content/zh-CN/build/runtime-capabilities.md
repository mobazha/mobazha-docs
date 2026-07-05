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
pageType: concept
outcome: 判断功能是否实际可用，同时区分源码存在、产品组合、能力、权限和就绪状态。
estimatedTime: 8 分钟
journey: build
primaryAction:
  label: 查看有效能力交集
  href: /zh/build/runtime-capabilities#新工作可用性
---

## 新工作可用性

所有适用门槛都通过后，能力才能对外公开或接纳新的操作。源码存在、标识符被识别、前端有组件或配置中出现名称，都不代表能力已启用。

```text
发布允许列表
  ∩ 契约兼容
  ∩ 已安装或静态组合
  ∩ 已授权
  ∩ 已配置
  ∩ 健康
```

这个投影回答的是当前上下文下，连接的后端能否接纳新工作。它不会删除已持久化的提供方绑定，也不授权后端放弃既有支付、结算、交付、补偿或对账义务；这些决策仍由所属领域管理器和 Core 状态决定。

## 客户端必须失败关闭

- 在权威能力快照就绪前，不渲染或调用可选功能。
- 允许未知的新增字段，但对畸形或不兼容版本安全拒绝。
- 导航、路由、操作控件和 Agent 工具使用同一能力键。
- 能力快照可以隐藏或阻止新操作，而已经绑定的工作仍可能需要继续服务或对账。
- 客户端隐藏控件不能代替服务端授权。

## 产品组合维度

- 认证模式只选择认证传输方式，不启用产品能力。
- 部署方式描述托管、自托管或自主运行。
- 产品体验选择平台、商店或市场外壳。
- 能力描述后端实际实现的产品行为。
- 权限描述当前主体可以做什么。
- 功能开关只用于实验或紧急关闭，不能替代授权。

## 当前前端组合切片

无框架依赖的解析内核通过 `@mobazha/commerce-kit/composition` 发布。它接收宿主拥有的产品档案、就绪状态、受支持档案矩阵、构建内特性目录，以及 capability 和 policy 判断函数。Unified 只负责把经过校验的 Runtime Config、展示渠道和店铺请求上下文适配到该内核。内核返回 `pending`、`ready` 或 `invalid`、启用和排除的特性 ID，以及结构化诊断；路由、Provider、授权和最终物化仍由各应用拥有。

首批接入统一解析结果的特性是：

- Guest Checkout，由有效的 `commerce.checkout` 能力控制；
- 市场运营路由与导航，只在受支持的托管档案且非店铺请求上下文中出现；
- 市场卖家审核路由与导航，使用同一组合边界。

能力仍在加载时保持等待状态，不能被解释为权威拒绝。档案不受支持、特性 ID 重复、后端能力缺失、外部资源受限或构建产物没有对应代码时都必须失败关闭。路由可见之后，后端授权仍然是操作权威。

产品操作是 Commerce Kit 的第二个实际验证切片。共享的 `CommerceProductActionButtons` 契约负责稳定的 `add-to-cart` 与 `buy-now` 操作身份、禁用状态、回调连接和可选的宿主渲染适配器。Unified 在桌面详情、移动详情和响应式底栏中使用它，同时继续拥有按钮、布局、本地化、库存、付款和资产政策。

购物车摘要是下一个实际验证切片。共享摘要内容统一商品数量、总额、结账禁用状态、结账操作和可选宿主渲染。Unified 在抽屉、桌面卖家分组底栏、多卖家总额和移动固定栏中使用它；卖家分组、登录或注册路由、币种显示、渠道专用操作、购物车存储和结账导航仍由宿主负责。

当前应用仍只把解析后的特性资格投影到路由与导航。单个商品或购物车的政策不是全局能力；产品操作和购物车摘要 API 在第二个独立应用验证相同边界前仍属于临时 `0.x` 契约。通用 Provider、工作流与操作贡献、浏览器扩展外壳接入、动态插件、远程 UI 和万能产品清单都不是当前公开契约。

一个下游自主发行也已经使用完整 runtime profile 与后端能力快照校验其构建内 catalog。本地 UI policy 可以隐藏已编入构建的特性，但后端能力缺失时不能暴露对应路由或导航。发行本地源码和产品词汇继续留在公共前端之外。

## 实现证据

- [兼容性政策](/project/compatibility)
- [Unified 运行时配置代码](https://github.com/mobazha/mobazha-unified/tree/main/packages/core/config)
- [Commerce Kit 组合解析内核](https://github.com/mobazha/mobazha-unified/blob/main/packages/commerce-kit/src/composition.ts)
- [前端产品组合实现说明](https://github.com/mobazha/mobazha-unified/blob/main/docs/architecture/FRONTEND_PRODUCT_COMPOSITION.md)
- [English canonical page](/build/runtime-capabilities)
