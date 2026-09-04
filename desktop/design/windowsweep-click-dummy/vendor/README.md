# Vendored libraries

Real D3 modules, vendored as **classic scripts** so the dummy opens by double-click over `file://`
with no network at all. ESM is CORS-blocked over `file://`, and a CDN tag would make a design
specification depend on being online - `aoneahsan-cccs-click-dummy` pitfall 7.

Only the modules the dummy actually uses: `d3-hierarchy` for the Reclaim Map treemap, the rest are its
and the sparkline's transitive needs. Full `d3` is ~280 KB; this set is 140 KB.

Regenerate exactly:

```bash
for m in d3-hierarchy@3.1.2 d3-shape@3.2.0 d3-scale@4.0.2 d3-array@3.2.4 d3-path@3.1.0 \
         d3-time@3.1.0 d3-time-format@4.1.0 d3-format@3.1.0 d3-interpolate@3.0.1 d3-color@3.1.0; do
  n="${m%@*}"; v="${m#*@}"
  curl -fsS -o "vendor/$n.js" "https://cdn.jsdelivr.net/npm/$n@$v/dist/${n}.min.js"
done
```

| File | Version | Bytes | SHA-256 |
|---|---|---:|---|
| `d3-array.js` | 3.2.4 | 17204 | `80aa70d0cd17dabddf6d056494ea17926a45a69da8b7850220aace331bad671d` |
| `d3-color.js` | 3.1.0 | 10577 | `a12639010163230b8c130fbeb92a3a49bb5f6989a566d3664d759522db458489` |
| `d3-format.js` | 3.1.0 | 5218 | `7d053f71a135100128802b6010ab58d1351ca412e2d7846c2f8c6fe155a66370` |
| `d3-hierarchy.js` | 3.1.2 | 14828 | `a8771380454be89ec5ffe9a6396ba7c247081e348ae740dc9cb9629abd4c0e43` |
| `d3-interpolate.js` | 3.0.1 | 7863 | `bfc321e4c3f3b3aadc88cfe15ccb5e443abfeadef8b75c65b41c33a4d78a98ae` |
| `d3-path.js` | 3.1.0 | 2433 | `28d70841c60f313c3e6411fe0831e539ed6cea51eaee951d62d88908c40619c2` |
| `d3-scale.js` | 4.0.2 | 15728 | `e76a84839ffba3b94fef22ea1e39da8398fa0e039c7e6a0a93b7d938dbd50632` |
| `d3-shape.js` | 3.2.0 | 30898 | `49236896e989f251dd36679ea4a879538e9ca2ece3a90a82740f953cac4a3fa5` |
| `d3-time.js` | 3.1.0 | 5994 | `0e67c6eed5832f4ac5bece0da0ea595860c4527d21c271a17013b7efe2665c00` |
| `d3-time-format.js` | 4.1.0 | 9912 | `ce7c943affe8cbb049de1c4ee29ce98bd4cb4b393bd48cb0c7b4f8078c4752f5` |

Licence: ISC (D3), Mike Bostock. Retrieved 2026-09-04 from jsdelivr.
