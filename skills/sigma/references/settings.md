# Sigma.js v3 — Settings & API cheatsheet

## Constructor

```ts
new Sigma(graph: Graph, container: HTMLElement, settings?: Partial<Settings>)
```

---

## Settings reference

### Rendering programs

| Setting | Default | Description |
|---|---|---|
| `nodeProgramClasses` | `{ circle: NodeCircleProgram }` | Map of type key → NodeProgram class |
| `nodeHoverProgramClasses` | `{}` | Override hover rendering per type |
| `edgeProgramClasses` | `{ line: EdgeLineProgram, arrow: EdgeArrowProgram, rectangle: EdgeRectangleProgram }` | Map of type key → EdgeProgram class |

### Node defaults

| Setting | Default | Description |
|---|---|---|
| `defaultNodeType` | `"circle"` | Fallback when node has no `type` attr |
| `defaultNodeColor` | `"#999"` | Fallback color |

### Edge defaults

| Setting | Default | Description |
|---|---|---|
| `defaultEdgeType` | `"line"` | Fallback type |
| `defaultEdgeColor` | `"#ccc"` | Fallback color |
| `renderEdgeLabels` | `false` | Show edge labels |

### Label — nodes

| Setting | Default | Description |
|---|---|---|
| `labelFont` | `"Arial"` | CSS font-family |
| `labelSize` | `14` | px |
| `labelWeight` | `"normal"` | CSS font-weight |
| `labelColor` | `{ color: "#000" }` | Uniform color or `{ attribute: "color", color?: fallback }` |
| `labelDensity` | `1` | Controls label collision — higher = fewer labels |
| `labelGridCellSize` | `100` | Grid cell size for label placement |

### Label — edges

| Setting | Default | Description |
|---|---|---|
| `edgeLabelFont` | `"Arial"` | CSS font-family |
| `edgeLabelSize` | `12` | px |
| `edgeLabelWeight` | `"normal"` | CSS font-weight |
| `edgeLabelColor` | `{ attribute: "color" }` | Same shape as `labelColor` |

### Sizing

| Setting | Default | Description |
|---|---|---|
| `zoomToSizeRatioFunction` | `(r) => Math.sqrt(r)` | Map zoom ratio to size multiplier |
| `itemSizesReference` | `"screen"` | `"screen"` or `"positions"` — coordinate system for sizes |
| `autoRescale` | `true` | Fit graph to container on load |

### Interaction

| Setting | Default | Description |
|---|---|---|
| `enableEdgeEvents` | `false` | Enable click/hover/wheel events on edges (extra GPU pass) |
| `zIndex` | `false` | Respect `zIndex` node/edge attribute |

### Custom draw functions

| Setting | Description |
|---|---|
| `defaultDrawNodeLabel` | `(ctx, data, settings) => void` — draw label on canvas |
| `defaultDrawNodeHover` | `(ctx, data, settings) => void` — draw hover state |
| `defaultDrawEdgeLabel` | `(ctx, edgeData, srcData, tgtData, settings) => void` |

### Reducers

| Setting | Signature | Description |
|---|---|---|
| `nodeReducer` | `(node: string, data: NodeDisplayData) => Partial<NodeDisplayData>` | Called per node before render |
| `edgeReducer` | `(edge: string, data: EdgeDisplayData) => Partial<EdgeDisplayData>` | Called per edge before render |

---

## Instance methods

```ts
// Graph management
sigma.getGraph(): Graph
sigma.setGraph(graph: Graph): void

// Settings
sigma.getSetting<K>(key: K): Settings[K]
sigma.setSetting<K>(key: K, value: Settings[K]): void
sigma.updateSetting<K>(key: K, updater: (v: Settings[K]) => Settings[K]): void

// Rendering
sigma.refresh(): void
sigma.scheduleRefresh(): void
sigma.scheduleRender(): void

// Camera
sigma.getCamera(): Camera
camera.getState(): { x, y, ratio, angle }
camera.setState(state): void
camera.animate(state, options): void      // options: { duration?, easing? }
camera.disable(): void                   // freeze camera input
camera.enable(): void

// Coordinate conversion
sigma.viewportToGraph({ x, y }): { x, y }
sigma.graphToViewport({ x, y }): { x, y }
sigma.viewportToFramedGraph({ x, y }): { x, y }
sigma.framedGraphToViewport({ x, y }): { x, y }

// Container
sigma.getContainer(): HTMLElement

// Node/edge hit testing
sigma.getNodeDisplayData(node: string): NodeDisplayData | undefined
sigma.getEdgeDisplayData(edge: string): EdgeDisplayData | undefined

// Layers
sigma.createCanvas(id: string, options?: { beforeLayer?: string; afterLayer?: string }): { canvas, context }
sigma.createWebGLContext(id: string, options?): { canvas, context }

// Teardown
sigma.kill(): void
```

---

## Events reference

### Interaction events payload

All carry `{ x: number, y: number, event: MouseEvent | TouchEvent }`.

| Event | Extra payload |
|---|---|
| `clickNode`, `rightClickNode`, `doubleClickNode`, `downNode`, `enterNode`, `leaveNode`, `wheelNode` | `node: string` |
| `clickEdge`, `rightClickEdge`, `doubleClickEdge`, `downEdge`, `enterEdge`, `leaveEdge`, `wheelEdge` | `edge: string` |
| `clickStage`, `rightClickStage`, `doubleClickStage`, `downStage`, `wheelStage` | — |

### Lifecycle events (no payload)

`beforeRender` · `afterRender` · `resize` · `kill`

---

## Migration v2 → v3

### Import paths changed

```ts
// v2
import Sigma from "sigma/sigma"
import { NodeProgram } from "sigma/rendering/webgl/programs/common/node"

// v3
import Sigma from "sigma"
import { NodeProgram } from "sigma/rendering"
```

### Program names renamed

| v2 | v3 |
|---|---|
| `node-fast` | `node.point` → `NodePointProgram` |
| `node` | `node.circle` → `NodeCircleProgram` |
| `node-image` | removed from core → `@sigma/node-image` |
| `edge-fast` | `edge.line` → `EdgeLineProgram` |
| `edge` | `edge.rectangle` → `EdgeRectangleProgram` |

### Settings renamed

| v2 | v3 |
|---|---|
| `enableEdgeClickEvents` + `enableEdgeWheelEvents` + `enableEdgeHoverEvents` | `enableEdgeEvents` |
| `labelRenderer` | `defaultDrawNodeLabel` |
| `hoverRenderer` | `defaultDrawNodeHover` |
| `edgeLabelRenderer` | `defaultDrawEdgeLabel` |

### Picking system

v3 replaced CPU collision detection with GPU picking: programs encode item IDs as 4-byte colors and use a `PICKING_MODE` shader macro. Existing custom programs must be rewritten.

### TypeScript generics

```ts
// v3 — Sigma mirrors graphology generics
const sigma = new Sigma<NodeAttrs, EdgeAttrs, GraphAttrs>(graph, container)
```
