---
title: 连接可选托管能力
summary: 将本地 Node 所有权与任何可选账号或托管服务连接明确分开。
status: Draft
audiences:
  - 运营者
evidenceLabel: Mobazha 公开发布边界
evidenceUrl: https://github.com/mobazha/mobazha/blob/main/README.md
reviewed: 2026-07-14
translationOf: self-host/bind-account
pageType: policy
outcome: 在交换 Node 或账号权限前，判断可选托管连接是否已有稳定公开合约。
estimatedTime: 4 分钟
journey: operate
primaryAction:
  label: 阅读当前状态
  href: /zh/self-host/bind-account#目前稳定的内容
---

## 目前稳定的内容

本地 standalone store 无需 Mobazha Hosting 账号，仍可用于管理、Listing、数据导出与受支持的 UTXO 付款流程。未来可选服务可能增加发现、搜索、路由、托管更新或支持。

> **Important:** 目前还没有稳定的公开 Node-to-account binding contract。不要把内部 endpoint、旧截图或历史设计文档当作受支持流程。

## 连接任何服务前

- 确认正在管理目标 Node 与账号。
- 创建新备份，并将恢复材料保存在浏览器会话之外。
- 要求清楚说明 capability、data exchange、permission、revocation 与 price。
- 不要把 seed phrase、wallet private key 或 database credential 粘贴到账号绑定表单。

## 受支持流程的发布 gate

- 公开 Node 与客户端仓库描述同一个 versioned contract。
- UI 显示 Node identity、requested permissions、exchanged data 与 revocation path。
- Authentication 不暴露 Node recovery material，也不会静默扩大 runtime capabilities。
- 自动化测试覆盖 connection、denial、expiry、revocation 与 recovery。

- [English canonical page](/self-host/bind-account)
