# Where a chart's data comes from

A chart is the surface where "just fetch it and reduce in the browser" looks most reasonable and costs most.
Everything below is the chart-shaped case of `aoneahsan-cccs-data-contract`.

## 🔴 A chart receives buckets, not rows

**The series is computed by the query.** Group, aggregate and bound server-side; what crosses the wire is the
answer — one point per rendered mark, or close to it.

```
❌  fetch 10,000 entries  ->  group by day in JS  ->  90 points on screen
✅  group by day in the query  ->  90 rows  ->  90 points
```

The failing version is not slow because JavaScript is slow. It is slow because it moved 10,000 rows over the
network, held them in memory, blocked the main thread reducing them, and — on a metered backend — spent 10,000
reads to draw 90 marks. One dashboard opened by every user each morning is how a free-tier quota is exhausted
before lunch.

**It also passes every review.** On a seeded development database the collection has 40 rows, so the fetch-all
version is indistinguishable from the correct one until the data grows.

| The chart shows | The query returns |
|---|---|
| a daily/weekly/monthly line or area | one row per bucket, already aggregated |
| a bar chart of categories | one row per category with its aggregate |
| a stacked bar | one row per (bucket, series) pair |
| a donut or pie | one row per slice — there are never many |
| a KPI tile with a delta | two numbers, not two row sets |
| a calendar heatmap | one row per day, for the window shown |
| a sparkline | the same buckets as its parent metric, reused — not a second fetch |

## The one legitimate client-side reduction

Reducing in the browser is correct when the data is **already bounded and already present**: a page of ≤50 rows
the user is looking at, or a genuinely local dataset — a bundled catalogue, a file the user just imported.
Charting a table page the user can see is fine. Charting a collection is not.

## Sizing the request to the pixels, not the model

A chart 600px wide cannot show 10,000 distinct marks — it has 600 columns. So the bucket width is a **rendering**
decision that belongs in the query: an hourly bucket over a year is 8,760 points drawn onto 600 pixels, which is
both wasted transfer and an unreadable chart.

Pick the granularity from the visible range, request that, and re-request when the range changes. A zoom is a
new query, not a client-side re-slice of everything.

## Two aggregate traps worth knowing

- **`sum()` and `average()` need the aggregated field in the composite index**, not just the filtered fields —
  otherwise the query fails at runtime with a precondition error while `count()` on the same shape succeeds.
- **A dense window and an empty window are both real.** The query returning zero rows is the chart's **empty
  state**, not an error; returning one row is the single-point case that breaks most chart layouts. Both are in
  the gallery's required state set for a reason.

## Ownership

The component owns **scales, axes, marks, motion and accessibility**. It does not own **what the numbers are**.
A chart component that fetches and aggregates has taken on the data layer's job, and the first sign is a
`useEffect` with a `.reduce()` in it.

Give it the buckets as a prop. That also makes it trivially testable and lets the same component render seeded
data in a click dummy and real data in the app.

**Last updated:** 2026-07-30
