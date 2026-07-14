---
title: 批量维护多个商品的供应
summary: 批量补充受跟踪的实体库存或导入 License code，同时保留部分失败信息且不改变无限供应。
status: Beta
audiences:
  - 卖家
  - 店铺运营者
evidenceLabel: Unified Admin 商品批量操作实现与测试
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/apps/web/src/app/admin/products/page.tsx
reviewed: 2026-07-14
translationOf: sell/catalog-operations
pageType: task
lastTested: 2026-07-14
outcome: 按预期供应模式更新选中商品，逐项验证结果，并只重试失败项目。
estimatedTime: 5–15 分钟
journey: use
primaryAction:
  label: 准备批量操作
  href: /zh/sell/catalog-operations#开始前
---

## 开始前

- 使用目标店铺上下文中的卖家或管理员身份。
- 确认连接部署提供 **Admin → Products** 及适用批量操作。源码存在不表示每个部署都提供该操作。
- 批量变更前记录选中的 Listing slug、当前供应模式和当前数量。
- 把受跟踪的实体库存和数字 License code 分开，它们使用不同操作和失败规则。

> **Warning:** License code 是履约秘密。不要把它们放入聊天、截图、支持 Issue、Analytics，或错误商品的批次。

## 增加受跟踪的实体库存

1. 在正确店铺上下文中打开 `/admin/products`，只选择需要改变的实体商品。
2. 选择批量补货。只有使用 Tracked stock 的 Listing 符合条件；以 `-1` 表示的无限数量不会被补货。
3. 输入正整数。相同增量会加到每个选中 Listing 的所有受跟踪 SKU Variant；它不是新的最终数量。
4. 复核目标标题和数量，然后确认一次。
5. 阅读成功和失败数量。重新打开或刷新受影响的 Listing，核对每个 Variant，而不是只相信 Toast。

## 导入 License code

1. 只选择供应模式为 License code 的 Listing，然后打开批量 License code 导入。
2. 在对应 Listing 的字段输入 Code。换行和逗号用于分隔，空白条目会被忽略。
3. 将每个 Listing 显示的解析数量与计划导入的来源对照。
4. 确认一次。结果会报告成功的 Listing 数量及其导入 Code 总数。
5. 通过 Listing 或履约流程验证可用供应。检查数量时不要暴露已导入值。

## 预期结果与验证

每个选中 Listing 都有独立结果。成功的实体补货会保留 Listing 结构，并把请求数量加到每个受跟踪 SKU；成功的 License code 导入会报告该 Listing 的导入数量。

| 结果 | 含义 | 安全下一步 |
|---|---|---|
| Success | 指定 Listing 操作成功返回 | 刷新并验证该 Listing 的供应状态 |
| `invalid_quantity` | 补货增量为零或负数 | 修正输入；没有有效补货请求 |
| `not_found` | 无法载入选中的 Listing | 重试前确认 Store context 与 Slug |
| `not_physical` | 非实体 Listing 进入实体补货路径 | 使用该 Listing 类型对应的供应操作 |
| `untracked_stock` | 所有 SKU 都使用无限供应 | 保持不变，除非有意把 Listing 改为受跟踪库存 |
| `no_keys` | 没有为该 Listing 分配 License code | 只有确实需要时才添加 Code |
| 其他失败 | Listing 更新或 License 导入未完成 | 刷新当前状态，只重试失败 Listing |

## 失败时

- 部分失败后不要重复整个批次，成功项目可能已经改变。
- 重试前刷新每个失败 Listing，避免覆盖并发编辑。
- 如果显示结果数量与 Listing 状态不一致，保留 Slug 和脱敏错误并[获取帮助](/zh/support)。
- 如果错误 Listing 收到数量变更，通过普通 Listing Editor 修正并保留审计说明；不要直接编辑数据库。
- 如果 License code 可能泄露或分配错误，停止使用受影响 Code，并执行店铺的秘密轮换和买家支持流程。

## 继续

- [发布和修改 Listing](/zh/sell/listings)
- [准备履约与配送](/zh/sell/shipping)
- [运营订单](/zh/sell/orders)
- [English canonical page](/sell/catalog-operations)
