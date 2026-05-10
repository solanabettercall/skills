---
name: sigma
description: Render and interact with large graphs in the browser using sigma.js v3. Use when visualizing graph data with WebGL (nodes, edges, labels), customizing appearance via reducers or custom programs, handling graph events, integrating map layers (Leaflet, MapLibre), or migrating from sigma v2.
license: MIT
metadata:
  author: solanabettercall
  version: "1.0"
compatibility: Browser only. Requires a DOM container. Use with graphology as the graph model.
---

# Sigma.js v3

Sigma.js is a WebGL-powered graph visualization library. It renders the graph from a **Graphology** instance and handles cameras, events, and custom rendering programs.

## Install

```bash
npm install sigma graphology
```

For optional node/edge programs:

```bash
npm install @sigma/node-image @sigma/node-border @sigma/node-piechart @sigma/node-square
npm install @sigma/edge-curve
npm install @sigma/layer-leaflet @sigma/layer-maplibre @sigma/layer-webgl
```

## Minimal setup

```ts
import Graph from "graphology"
import Sigma from "sigma"

const graph = new Graph()
graph.addNode("a", { label: "Alice", x: 0, y: 0, size: 10, color: "#6A9FB5" })
graph.addNode("b", { label: "Bob",   x: 1, y: 1, size: 15, color: "#D95B43" })
graph.addEdge("a", "b", { size: 2, color: "#ccc" })

const sigma = new Sigma(graph, document.getElementById("container") as HTMLElement)
```

## Imports (v3 entry points)

```ts
import Sigma from "sigma"                        // Sigma class + Camera, MouseCaptor, TouchCaptor
import { Settings } from "sigma/settings"         // Settings interface + defaults
import { NodeCircleProgram } from "sigma/rendering"
import type { NodeDisplayData } from "sigma/types"
import { floatColor } from "sigma/utils"
```

## Node attributes

| Attribute | Type | Description |
|---|---|---|
| `x`, `y` | number | Canvas position (set by layout) |
| `size` | number | Radius in pixels at default zoom |
| `color` | string | Hex or CSS color |
| `label` | string | Text displayed near node |
| `type` | string | Node program key (`"circle"`, `"point"`, …) |
| `hidden` | boolean | Skip rendering when `true` |
| `forceLabel` | boolean | Always show label regardless of zoom |
| `zIndex` | number | Draw order (higher = on top); needs `zIndex` setting |

## Edge attributes

| Attribute | Type | Description |
|---|---|---|
| `size` | number | Thickness in pixels |
| `color` | string | Hex or CSS color |
| `label` | string | Text near edge (needs `renderEdgeLabels: true`) |
| `type` | string | Edge program key (`"line"`, `"arrow"`, `"curve"`, …) |
| `hidden` | boolean | Skip rendering |
| `forceLabel` | boolean | Always show label |
| `zIndex` | number | Draw order (edges never appear above nodes) |

## Lifecycle

```ts
// Construct
const sigma = new Sigma(graph, container, settings?)

// Swap the graph at runtime
sigma.setGraph(newGraph)

// Manual refresh
sigma.refresh()            // process reducers → render
sigma.scheduleRefresh()    // same, but deferred to next rAF
sigma.scheduleRender()     // render only (no processing) — next rAF if not pending

// Teardown
sigma.kill()               // releases all bindings and canvas elements
```

Rendering triggers automatically on graphology mutations, settings changes, and camera/mouse interactions.

## Settings (key subset)

```ts
const sigma = new Sigma(graph, container, {
  // Node defaults
  defaultNodeType: "circle",        // "circle" | "point" | any custom key
  defaultNodeColor: "#999",

  // Edge defaults
  defaultEdgeType: "line",          // "line" | "rectangle" | "arrow" | any custom key
  defaultEdgeColor: "#ccc",
  renderEdgeLabels: false,

  // Labels
  labelFont: "sans-serif",
  labelSize: 14,
  labelWeight: "normal",
  labelColor: { color: "#000" },           // or { attribute: "color" }
  edgeLabelFont: "sans-serif",
  edgeLabelSize: 12,

  // Sizing behaviour
  zoomToSizeRatioFunction: (ratio) => Math.sqrt(ratio),  // default
  itemSizesReference: "screen",     // "screen" | "positions"
  autoRescale: true,

  // z-index
  zIndex: false,

  // Edge events (off by default — cost extra render pass)
  enableEdgeEvents: false,

  // Custom draw functions
  defaultDrawNodeLabel: drawLabel,
  defaultDrawNodeHover: drawHover,
  defaultDrawEdgeLabel: drawEdgeLabel,

  // Custom programs
  nodeProgramClasses: {
    circle: NodeCircleProgram,
    image: NodeImageProgram,   // from @sigma/node-image
  },
  edgeProgramClasses: {
    arrow: EdgeArrowProgram,
    curve: EdgeCurveProgram,   // from @sigma/edge-curve
  },
})
```

See [Settings reference](references/settings.md) for the full list.

## Reducers (dynamic appearance)

Reducers transform attributes before rendering without mutating the graph. Return a partial `NodeDisplayData` / `EdgeDisplayData`.

```ts
sigma.setSetting("nodeReducer", (node, data) => {
  if (node === hoveredNode) return { ...data, highlighted: true, size: data.size * 1.5 }
  if (neighborSet.has(node)) return { ...data, color: "#e22" }
  return { ...data, color: "#ddd", label: "" }
})

sigma.setSetting("edgeReducer", (edge, data) => {
  if (graph.hasExtremity(edge, hoveredNode)) return data
  return { ...data, hidden: true }
})
```

Reset a setting:

```ts
sigma.setSetting("nodeReducer", null)
```

## Events

```ts
// Node events
sigma.on("clickNode",       ({ node, event }) => { })
sigma.on("rightClickNode",  ({ node, event }) => { })
sigma.on("doubleClickNode", ({ node, event }) => { })
sigma.on("enterNode",       ({ node }) => { })
sigma.on("leaveNode",       ({ node }) => { })
sigma.on("downNode",        ({ node, event }) => { })
sigma.on("wheelNode",       ({ node, event }) => { })

// Edge events (requires enableEdgeEvents: true)
sigma.on("clickEdge",  ({ edge, event }) => { })
sigma.on("enterEdge",  ({ edge }) => { })
sigma.on("leaveEdge",  ({ edge }) => { })

// Stage (background) events
sigma.on("clickStage",       ({ event }) => { })
sigma.on("rightClickStage",  ({ event }) => { })
sigma.on("doubleClickStage", ({ event }) => { })
sigma.on("downStage",        ({ event }) => { })
sigma.on("wheelStage",       ({ event }) => { })

// Lifecycle events
sigma.on("beforeRender", () => { })
sigma.on("afterRender",  () => { })
sigma.on("resize",        () => { })
sigma.on("kill",          () => { })
```

All interaction events include `{ x, y }` (container coordinates) and `event` (original `MouseEvent` or `TouchEvent`).

## Camera API

```ts
const camera = sigma.getCamera()

// Read state
const { x, y, ratio, angle } = camera.getState()

// Animate to position
camera.animate({ x: 0.5, y: 0.5, ratio: 1 }, { duration: 500 })

// Reset to default view
camera.animate(camera.getState(), { duration: 400 })

// Convert coordinates
const graphCoords = sigma.viewportToGraph({ x: mouseX, y: mouseY })
const screenCoords = sigma.graphToViewport({ x: nodeX, y: nodeY })
```

## Coordinate systems

| Space | Description |
|---|---|
| `graph` | Raw node `x`/`y` values from Graphology |
| `framedGraph` | Normalized to [0,1] preserving aspect ratio |
| `viewport` | Pixels in the container, Y-flipped |
| `clipspace` | WebGL NDC [-1,1] — vertex shader output |

## Layers

Default layer stack (bottom → top):

```
sigma-edges       (WebGL)
sigma-nodes       (WebGL)
sigma-edgeLabels  (Canvas)
sigma-labels      (Canvas)
sigma-hovers      (Canvas)
sigma-hoverNodes  (WebGL)
sigma-mouse       (interaction capture)
```

Add a custom canvas layer:

```ts
const { canvas, context } = sigma.createCanvas("myLayer", {
  beforeLayer: "sigma-labels",   // insert before this layer
})
// context is a CanvasRenderingContext2D
sigma.on("afterRender", () => {
  context.clearRect(0, 0, canvas.width, canvas.height)
  // draw custom content
})
```

## Custom node program (outline)

```ts
import { NodeProgram, NodeProgramType } from "sigma/rendering"
import type { NodeDisplayData, RenderParams } from "sigma/types"

class NodeSquareProgram extends NodeProgram<{ angle: Float32Array }> {
  static getDefinition() {
    return {
      VERTICES: 4,
      VERTEX_SHADER_SOURCE: `/* glsl */...`,
      FRAGMENT_SHADER_SOURCE: `/* glsl */...`,
      UNIFORMS: ["u_matrix", "u_sizeRatio", "u_correctionRatio", "u_pixelRatio"] as const,
      ATTRIBUTES: [
        { name: "a_id",       size: 1, type: FLOAT },
        { name: "a_position", size: 2, type: FLOAT },
        { name: "a_size",     size: 1, type: FLOAT },
        { name: "a_color",    size: 4, type: UNSIGNED_BYTE, normalized: true },
      ],
    }
  }
  processVisibleItem(offset: number, data: NodeDisplayData) { /* fill vertex array */ }
  draw(params: RenderParams) { /* set uniforms + gl.drawArrays */ }
}
```

## Additional packages

| Package | Purpose |
|---|---|
| `@sigma/node-image` | Render nodes as images (texture atlas) |
| `@sigma/node-border` | Concentric border rings |
| `@sigma/node-piechart` | Pie-chart nodes |
| `@sigma/node-square` | Square-shaped nodes |
| `@sigma/edge-curve` | Curved edges |
| `@sigma/layer-leaflet` | Overlay sigma on a Leaflet map |
| `@sigma/layer-maplibre` | Overlay sigma on a MapLibre map |
| `@sigma/layer-webgl` | Custom WebGL layers (metaballs, contours) |

## Gotchas

- **Browser only** — Sigma requires a real DOM. No SSR/Node.js without mocking.
- **Graphology is required** — sigma renders from a graphology `Graph`; bring your own instance.
- **`x`/`y` must exist** — nodes without `x` and `y` will render at `(0, 0)`. Run a layout first (e.g. `graphology-layout-forceatlas2`).
- **Edge events are off by default** — they add an extra GPU picking pass. Enable with `enableEdgeEvents: true`.
- **Edges never render above nodes** — even with `zIndex`; this is by design.
- **`kill()` is mandatory** on unmount — it cleans up canvas elements, event listeners, and RAF loops.
- **v3 breaks v2 imports** — program names changed, entry points restructured. See [Migration guide](references/settings.md#migration-v2-v3).
- **TypeScript generics** — `Sigma<NodeAttrs, EdgeAttrs, GraphAttrs>` mirrors graphology's generics.

## Reference

- [Settings & API cheatsheet](references/settings.md)
- [Boilerplate](assets/basic-setup.ts)

### Official docs

- [Introduction](https://www.sigmajs.org/docs/)
- [Quickstart](https://www.sigmajs.org/docs/quickstart)
- [Advanced topics](https://www.sigmajs.org/docs/category/advanced-topics)
- [Typedoc API](https://www.sigmajs.org/docs/category/typedoc-api)
- [Storybook examples](https://www.sigmajs.org/storybook)
