# Lifecycle, degenerate data, and the canvas threshold

The four cases that are cheap to get right and expensive to discover late. `SKILL.md` states each rule; this
is the working code.

## Force simulations have a lifecycle

```tsx
useEffect(() => {
  const sim = forceSimulation(nodes)
    .force('link', forceLink(links).id((d: any) => d.id))
    .force('charge', forceManyBody().strength(-200))
    .force('center', forceCenter(width / 2, height / 2))
    .on('tick', () => setPositions(nodes.map(n => ({ ...n }))));

  return () => { sim.stop(); };     // 🔴 without this it runs forever after unmount
}, [nodes, links, width, height]);
```

An unstopped simulation keeps ticking, keeps calling `setState` on an unmounted component, and keeps the
whole graph in memory. Call `sim.stop()` in the cleanup — always. The symptom is not a crash: it is a page
that grows slower the longer someone uses it, which is why it survives review.

## Empty

A designed empty state, never blank axes. Blank axes look like a chart that failed to load, so the user
retries instead of acting. Say what would fill it: *"No sessions logged yet — your first one appears here."*

Keep the axes' domain fixed to the metric's reachable range even when empty, so the chart does not jump the
moment a first value arrives.

## A single data point

A line chart with one datum draws **nothing** — a path between one point has no length. Render a dot with its
value labelled.

```tsx
const path = line<Datum>().x(d => x(d.at)).y(d => y(d.value));

return data.length === 1
  ? <circle cx={x(data[0].at)} cy={y(data[0].value)} r={4} className="fill-[--color-accent]" />
  : <path d={path(data) ?? undefined} className="stroke-[--color-accent]" fill="none" />;
```

The same holds for area and for any shape generator that interpolates between points.

## Canvas above roughly 1,000 marks

SVG creates a DOM node per mark. Past a few thousand, layout, hit-testing and re-render cost dominate, and
the chart feels broken on a mid-range phone long before it does on a laptop.

Keep D3 for the scales, the axes and the data join, and draw the marks to a canvas context:

```tsx
const ctx = canvasRef.current!.getContext('2d')!;
ctx.clearRect(0, 0, width, height);
for (const d of data) {
  ctx.fillStyle = colour(d.series);
  ctx.fillRect(x(d.at), y(d.value), 2, 2);
}
```

The accessible table requirement does not change — a canvas is opaque to a screen reader, so the table
carries the whole meaning. Hit-testing becomes yours to implement; a quadtree (`d3-quadtree`) over the same
scaled positions is the usual answer.

**Last updated:** 2026-07-29

---

## The boundary, in code

Moved out of `SKILL.md` 2026-07-30 (size budget). The rule — React owns the DOM, D3 owns the maths — stays there.

```tsx
function LineChart({data, width, height}: Props) {
  // D3: scales, shapes, layout — pure calculation, no selections
  const x = useMemo(() => scaleTime().domain(extent(data, d => d.at) as [Date, Date]).range([0, width]), [data, width]);
  const y = useMemo(() => scaleLinear().domain([0, max(data, d => d.value)!]).nice().range([height, 0]), [data, height]);
  const d = useMemo(() => line<Point>().x(p => x(p.at)).y(p => y(p.value))(data), [data, x, y]);

  // React: renders it
  return (
    <svg width={width} height={height} role="img" aria-label="Water intake over the last 30 days">
      <path d={d ?? ''} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
    </svg>
  );
}
```

Use `d3-selection` **only** where React cannot help — a force simulation's per-tick updates, or a zoom
behaviour's event plumbing. Then confine it to a `useRef`'d subtree React never renders into.

## Responsive sizing and dialled data (moved verbatim from SKILL.md, 2026-11-02)

`ResizeObserver` on the container, not a window listener — the container changes when a sidebar opens and the
window does not.

```tsx
const [box, setBox] = useState({width: 0, height: 0});
useEffect(() => {
  const ro = new ResizeObserver(([e]) => setBox({
    width: e.contentRect.width, height: e.contentRect.height,
  }));
  ro.observe(ref.current!);
  return () => ro.disconnect();          // ← or it observes forever
}, []);
```

Render nothing until `width > 0`; a chart drawn at zero width produces `NaN` paths.

🔴 **A chart is specified only once its data can be DIALLED.** Charts fail on data, not on styling, so a
gallery specimen holding one plausible series proves almost nothing. Every chart ships knobs for series count
(1 · 3 · palette max · one past it), point count (1 · 7 · 365), **zero, negative and null** values, a single
spike flattening everything else, **all-equal values** — a zero-width domain, which divides by zero in a naive
scale and is the case nobody tries — long category labels, plus loading and empty. The dial catalogue and the
harness: **`aoneahsan-cccs-component-playground`**.
