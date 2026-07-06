---
title: Identity、店铺与 Storefront
summary: 分开理解访问账户、店铺与 Node 身份、Storefront 展示以及渠道上下文，使所有权和交易权威保持清晰。
status: Beta
audiences:
  - 买家
  - 卖家
  - 运营者
  - 开发者
  - 评估者
evidenceLabel: Mobazha 公开身份、Profile、能力与架构契约
evidenceUrl: https://github.com/mobazha
reviewed: 2026-07-06
translationOf: project/identity-and-stores
pageType: concept
outcome: 当用户需要新的登录方式、店铺、店面或分发渠道时，判断真正应该改变哪一层边界。
estimatedTime: 8 分钟
journey: start
primaryAction:
  label: 准备店铺
  href: /zh/sell
featuredVisual: identity-storefront-model
---

## 四个不同的产品概念

Mobazha 将四个概念分开，因为它们承载的权威不同：

| 概念 | 负责什么 | 不能证明什么 |
|---|---|---|
| Account 或 Credential | 验证人、服务或 Agent，并关联允许访问的店铺上下文 | 客户端里看到的每个店铺都归该账户所有 |
| Store 与 Node Identity | 标识独立经营单元，以及拥有其业务状态的后端 | 永久依赖某个托管账户、域名或渠道 |
| Storefront | 为同一个店铺提供经过筛选、换主题或不同路由的展示 | 独立钱包、订单账本、信誉或法律主体 |
| Channel | 将 Storefront 带入 Web、嵌入式、社交、直接链接或集成场景 | 修改店铺或绕过后端能力的权限 |

一个界面可以同时展示这四层，但它们在产品模型中仍然独立。

## 店铺是业务状态边界

在 Open Core 中，Node 暴露 Profile 和节点级商业服务。店铺上下文拥有或服务于该独立经营单元的目录、政策、订单、消息、支付观察、履约记录和信誉。

托管控制面可以把经过验证的账户与一个或多个已登记店铺关联，并为管理请求解析活动店铺。这是访问和路由事实。切换账户或客户端不能静默改写店铺 peer identity、交易历史或已经接受的义务。

- [Mobazha 产品地图](/zh/project/product-map)
- [查看英文架构与信任边界](/project/architecture)
- [选择托管服务或自行托管](/zh/start/choose-deployment)

## Storefront 是视图，不是另一个店铺

Storefront 可以为同一个店铺提供不同公开名称、slug、主题、商品筛选、可见性规则、价格展示或渠道入口，但共享业务状态仍由父店铺拥有。

展示或分发需求适合使用 Storefront：

- 活动页或季节目录；
- 社群专属入口；
- 公开、unlisted 或受限展示；
- 不同主题或商品子集；
- 指向同一个经营店铺的 Web、嵌入式或直接链接路由。

需要独立业务状态时应使用独立 Store 或 Node，例如不同运营者、钱包或支付配置、订单账本、信誉边界、法律责任、基础设施或恢复计划。

> **Important:** Storefront 受运行时能力控制。本页描述的模型或路由不表示当前连接后端已经启用命名 Storefront、全部可见性模式、渠道绑定或价格规则。

## 角色由当前上下文解析

同一个人可以在不同时候浏览、购买、管理店铺、处理争议或运行集成。这些是动作上下文，不是让一个 Session 自动拥有所有权限的理由。

执行受保护动作之前，系统需要解析：

1. 已认证的身份或 Credential；
2. 当前 Store，以及相关时的 Storefront 上下文；
3. 该动作要求的 Scope 或 Role；
4. 后端能力和当前资源状态；
5. 适用的报价、政策、确认或 Step-up 要求。

切换可见视图不能补出缺失的 Scope；隐藏 Admin 路由也不能替代服务端授权。

- [查看英文身份认证与权限](/build/authentication)
- [运行时能力与产品组合](/zh/build/runtime-capabilities)

## 当前模型与演进方向

| 领域 | 当前公开含义 | 必须继续标为方向的内容 |
|---|---|---|
| Node Profile 与店铺政策 | 节点级身份和商业配置属于 Core 模型 | 更丰富、可移植或外部锚定的身份证明 |
| 托管账户关联 | 托管身份可以被授权到明确店铺上下文 | 更广泛的多 Identity 与多运营者管理 |
| Storefront | 发行版可以启用轻量展示模型 | 更多渠道绑定、范围化分析、访问与价格规则 |
| 多店铺 | 已登记店铺仍是相互独立的经营单元 | 更方便的创建、切换、Staff 委派与跨店报表 |
| 渠道组合 | 客户端和发行版选择体验并收窄能力 | 更多社交、嵌入式、浏览器和 Agent 界面 |

实际可用性仍由当前连接后端的有效能力和适用发布决定。内部设计阶段与未来身份模型不是当前产品保证。

## 选择满足需求的最小边界

| 需求 | 优先选择 |
|---|---|
| 不同主题、商品子集、活动或社群入口 | 后端支持时使用 Storefront |
| 不同域名指向同一个经营店铺 | 带明确 Store 上下文的域名或渠道路由 |
| 独立订单、钱包配置、信誉或运营责任 | 独立 Store 或 Node |
| 另一个人或 Agent 只协助有限职责 | 支持时使用窄范围账户、Token 或委派 Scope |
| 运营者也不能关联的强隐私隔离 | 真正独立的 Identity 和运行边界，而不是装饰性 Storefront |

- [English canonical page](/project/identity-and-stores)

应从能够保留所需信任、记账和恢复模型的最轻边界开始，不能用新 Storefront 模拟它无法提供的隔离。
