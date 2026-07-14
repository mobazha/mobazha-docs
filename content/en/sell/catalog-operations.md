---
title: Maintain supply across several listings
summary: Restock tracked physical listings or import license codes in batches without hiding partial failures or changing unlimited supply.
status: Beta
audiences:
  - Sellers
  - Store operators
evidenceLabel: Unified Admin product bulk-action implementation and tests
evidenceUrl: https://github.com/mobazha/mobazha-unified/blob/main/apps/web/src/app/admin/products/page.tsx
reviewed: 2026-07-14
pageType: task
lastTested: 2026-07-14
outcome: Update the intended supply mode across selected listings, verify each result, and retry only the failed items.
estimatedTime: 5–15 minutes
journey: use
primaryAction:
  label: Prepare the batch
  href: /sell/catalog-operations#before-you-start
---

## Before you start

- Use the seller or administrator identity for the intended store context.
- Confirm that the connected deployment exposes **Admin → Products** and the applicable bulk action. Source presence does not make the action available on every deployment.
- Record the selected listing slugs, current supply mode, and current quantities before a bulk change.
- Separate tracked physical stock from digital license-code supply. They use different operations and failure rules.

> **Warning:** License codes are fulfillment secrets. Do not paste them into chat, screenshots, support issues, analytics, or a batch for the wrong listing.

## Add tracked physical stock

1. Open `/admin/products` in the correct store context and select only the physical listings you intend to change.
2. Choose the bulk restock action. The action is eligible only for listings using tracked stock; an unlimited quantity represented by `-1` is deliberately not restocked.
3. Enter a positive whole-number quantity. The same increment is added to every tracked SKU variant in each selected listing; it is not a new final quantity.
4. Review the target titles and count, then confirm once.
5. Read the success and failure counts. Re-open or refresh the affected listings and verify every variant quantity rather than relying only on the toast.

## Import license codes

1. Select only listings whose supply mode is license codes, then open the bulk license-code import action.
2. Enter codes in the field for the matching listing. Newlines and commas separate codes; blank entries are ignored.
3. Compare the parsed count shown for each listing with the source you intended to import.
4. Confirm once. The result reports how many listings succeeded and how many codes were imported from successful assignments.
5. Verify usable supply through the listing or fulfillment workflow. Do not expose the imported values while checking the count.

## Expected result and verification

Each selected listing produces its own result. A successful physical restock preserves the listing shape and adds the requested quantity to each tracked SKU. A successful license-code import reports an imported count for that listing.

| Result | What it means | Safe next action |
|---|---|---|
| Success | The named listing operation returned successfully | Refresh and verify that listing's supply state |
| `invalid_quantity` | The restock increment was zero or negative | Correct the input; no valid restock was requested |
| `not_found` | The selected listing could not be loaded | Confirm store context and slug before retrying |
| `not_physical` | A non-physical listing reached the physical restock path | Use the supply operation for that listing type |
| `untracked_stock` | Every SKU uses unlimited supply | Leave it unchanged unless the listing is intentionally converted to tracked stock |
| `no_keys` | No license codes were assigned to that listing | Add codes only if that listing should receive them |
| Other failure | The listing update or license import did not complete | Refresh current state and retry only the failed listing |

## If something fails

- Do not repeat the whole batch after a partial failure. Successful items may already have changed.
- Refresh each failed listing before retrying so a concurrent edit is not overwritten.
- If the visible result count and listing state disagree, preserve the listing slug and sanitized error, then [get help](/support).
- If the wrong listing received a quantity change, correct it through the normal listing editor and preserve an audit note; do not edit the database directly.
- If license codes may have been disclosed or assigned incorrectly, stop using the affected codes and follow the store's secret-rotation and buyer-support process.

## Continue

- [Publish and revise listings](/sell/listings)
- [Prepare fulfillment and shipping](/sell/shipping)
- [Operate orders](/sell/orders)
