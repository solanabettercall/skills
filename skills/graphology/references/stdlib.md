# Graphology — Standard Library

Each package is a separate npm install: `npm install graphology-<name>`

---

## Assertions (`graphology-assertions`)

```ts
import { isGraph, isGraphConstructor, haveSameNodes, haveSameNodesDeep,
         areSameGraphs, areSameGraphsDeep, haveSameEdges, haveSameEdgesDeep } from "graphology-assertions"

isGraph(value): boolean
isGraphConstructor(value): boolean
haveSameNodes(g1, g2): boolean
haveSameNodesDeep(g1, g2): boolean        // compares attributes too
areSameGraphs(g1, g2): boolean
areSameGraphsDeep(g1, g2): boolean
haveSameEdges(g1, g2): boolean
haveSameEdgesDeep(g1, g2): boolean
```

---

## Components (`graphology-components`)

```ts
import { connectedComponents, largestConnectedComponent,
         largestConnectedComponentSubgraph, cropToLargestConnectedComponent,
         stronglyConnectedComponents, forEachConnectedComponent,
         forEachConnectedComponentOrder, countConnectedComponents } from "graphology-components"

connectedComponents(graph): string[][]
largestConnectedComponent(graph): string[]
largestConnectedComponentSubgraph(graph): Graph
cropToLargestConnectedComponent(graph): void    // mutates graph
stronglyConnectedComponents(graph): string[][]  // directed/mixed only
countConnectedComponents(graph): number
forEachConnectedComponent(graph, cb: (component: string[]) => void): void
forEachConnectedComponentOrder(graph, cb: (order: number) => void): void
```

---

## DAG (`graphology-dag`)

```ts
import { hasCycle, willCreateCycle, topologicalSort,
         topologicalGenerations, forEachNodeInTopologicalOrder,
         forEachTopologicalGeneration } from "graphology-dag"

hasCycle(graph): boolean
willCreateCycle(graph, source, target): boolean
topologicalSort(graph): string[]
topologicalGenerations(graph): string[][]
forEachNodeInTopologicalOrder(graph, cb: (node, attrs) => void): void
forEachTopologicalGeneration(graph, cb: (nodes: string[]) => void): void
```

---

## Traversal (`graphology-traversal`)

```ts
import { bfs, bfsFromNode, dfs, dfsFromNode } from "graphology-traversal"

// cb receives (node, attrs, depth) — return true to stop deeper traversal
bfs(graph, cb, options?)
bfsFromNode(graph, startNode, cb, options?)
dfs(graph, cb, options?)
dfsFromNode(graph, startNode, cb, options?)

// options: { mode: "outbound" | "inbound" | "directed" | "undirected" }  // default: "outbound"
```

---

## Shortest Path (`graphology-shortest-path`)

```ts
import { bidirectional, singleSource, singleSourceLength,
         undirectedSingleSourceLength } from "graphology-shortest-path/unweighted"
import dijkstra from "graphology-shortest-path/dijkstra"
import { bidirectional as aStar } from "graphology-shortest-path/astar"
import { edgePathFromNodePath } from "graphology-shortest-path"

// Unweighted
bidirectional(graph, source, target): string[] | null
singleSource(graph, source): { [node]: path[] }
singleSourceLength(graph, source): { [node]: number }
undirectedSingleSourceLength(graph, source): { [node]: number }

// Dijkstra
dijkstra.bidirectional(graph, source, target, getEdgeWeight?): string[] | null
dijkstra.singleSource(graph, source, getEdgeWeight?): { [node]: path[] }

// A*
aStar(graph, source, target, heuristic, getEdgeWeight?): string[] | null

// Utility
edgePathFromNodePath(graph, nodePath): string[]
```

---

## Simple Path (`graphology-simple-path`)

```ts
import { allSimplePaths, allSimpleEdgePaths, allSimpleEdgeGroupPaths } from "graphology-simple-path"

// Returns array of paths (each path is string[])
allSimplePaths(graph, source, target, options?)
allSimpleEdgePaths(graph, source, target, options?)
allSimpleEdgeGroupPaths(graph, source, target, options?)  // for multigraphs

// options: { maxDepth: number }
// source === target finds cycles
```

---

## Metrics (`graphology-metrics`)

```ts
import { density, diameter, extent, modularity, simpleSize, weightedSize } from "graphology-metrics/graph"
import { weightedDegree, eccentricity } from "graphology-metrics/node"
import { disparity, simmelianStrength } from "graphology-metrics/edge"
import betweenness from "graphology-metrics/centrality/betweenness"
import edgeBetweenness from "graphology-metrics/centrality/edge-betweenness"
import closeness from "graphology-metrics/centrality/closeness"
import degreeCentrality from "graphology-metrics/centrality/degree"
import eigenvector from "graphology-metrics/centrality/eigenvector"
import hits from "graphology-metrics/centrality/hits"
import pagerank from "graphology-metrics/centrality/pagerank"
import { connectedCloseness, edgeUniformity, neighborhoodPreservation, stress } from "graphology-metrics/layout-quality"

// Most centrality functions have .assign() variant that writes results to node attributes
betweenness(graph, options?): { [node]: number }
betweenness.assign(graph, options?): void
pagerank.assign(graph, { attribute: "pagerank", ...options }): void
```

---

## Communities — Louvain (`graphology-communities-louvain`)

```ts
import louvain from "graphology-communities-louvain"

louvain(graph, options?): { [node]: communityId }
louvain.assign(graph, options?): void          // writes to node attribute
louvain.detailed(graph, options?): {
  communities: { [node]: communityId },
  count: number,
  modularity: number,
  moves: number[],
  deltaComputations: number,
  nodesVisited: number,
  dendrogram: object[],
}

// options: { getEdgeWeight, nodeCommunityAttribute, resolution, fastLocalMoves, randomWalk, rng }
```

---

## Operators (`graphology-operators`)

```ts
import { subgraph, reverse } from "graphology-operators"
import { disjointUnion, union } from "graphology-operators"
import { toDirected, toUndirected, toMixed, toMulti, toSimple } from "graphology-operators"

subgraph(graph, nodes: string[] | Set<string> | (node, attrs) => bool): Graph
reverse(graph): Graph                    // reverses directed edges

union(g1, g2): Graph                    // merges attrs on collision
disjointUnion(g1, g2): Graph            // relabels to keep separate

toDirected(graph): Graph                // undirected → mutual directed pairs
toUndirected(graph): Graph              // directed → undirected
toMixed(graph): Graph
toMulti(graph): Graph
toSimple(graph): Graph                  // multigraph → keep one edge per pair
```

---

## Generators (`graphology-generators`)

```ts
import { complete, empty, ladder, path } from "graphology-generators/classic"
import { caveman, connectedCaveman } from "graphology-generators/community"
import { clusters, erdosRenyi, girvanNewman } from "graphology-generators/random"
import { krackhardtKite } from "graphology-generators/small"
import { florentineFamilies, karateClub } from "graphology-generators/social"

complete(Graph, n): Graph
erdosRenyi(Graph, { order, probability }): Graph
clusters(Graph, { order, size, clusters }): Graph
karateClub(Graph): Graph
```

---

## Cores (`graphology-cores`)

```ts
import { coreNumber, kCore, kShell, kCrust, kCorona, kTruss, onionLayers } from "graphology-cores"

coreNumber(graph): { [node]: number }
kCore(graph, k): Graph
kShell(graph, k): Graph
kCrust(graph, k): Graph
kCorona(graph, k): Graph
kTruss(graph, k): Graph
onionLayers(graph): { [node]: number }
```

---

## Bipartite (`graphology-bipartite`)

```ts
import { isBipartiteBy } from "graphology-bipartite"

isBipartiteBy(graph, getNodePartition: string | (node, attrs) => any): boolean
```

---

## Layout (`graphology-layout`)

Nodes need `x` and `y` attributes before most layout algorithms.

```ts
import { circular, random, circlePack } from "graphology-layout"
import { rotation, collectLayout, assignLayout,
         collectLayoutAsFlatArray, assignLayoutAsFlatArray } from "graphology-layout/utils"

circular(graph, options?): { [node]: { x, y } }
circular.assign(graph, options?): void

random(graph, options?): { [node]: { x, y } }
random.assign(graph, options?): void

circlePack(graph, options?): { [node]: { x, y } }
circlePack.assign(graph, options?): void
```

---

## Layout — Force (`graphology-layout-force`)

```ts
import forceLayout, { ForceSupervisor } from "graphology-layout-force"

forceLayout(graph, { iterations: 50, settings: { attraction, repulsion, gravity, inertia, maxMove } })
forceLayout.assign(graph, options)

// Async (does not block UI)
const supervisor = new ForceSupervisor(graph, options)
supervisor.start()
supervisor.stop()
supervisor.kill()
supervisor.isRunning(): boolean
```

**Default settings:** `attraction: 0.0005`, `repulsion: 0.1`, `gravity: 0.0001`, `inertia: 0.6`, `maxMove: 200`

---

## Layout — ForceAtlas2 (`graphology-layout-forceatlas2`)

```ts
import forceAtlas2, { FA2Layout } from "graphology-layout-forceatlas2"

// Nodes must already have x and y
forceAtlas2(graph, { iterations: 50, settings: { ... } })
forceAtlas2.assign(graph, { iterations: 50 })

// Auto-tune settings for the graph
const settings = forceAtlas2.inferSettings(graph)

// Web Worker
const layout = new FA2Layout(graph, { settings })
layout.start()
layout.stop()
layout.kill()
layout.isRunning(): boolean
```

**Key settings:** `gravity`, `scalingRatio`, `slowDown`, `barnesHutOptimize`, `barnesHutTheta`, `linLogMode`, `strongGravityMode`, `edgeWeightInfluence`

---

## Layout — Noverlap (`graphology-layout-noverlap`)

Anti-collision layout. Nodes must have `x` and `y`.

```ts
import noverlap, { NoverlapLayout } from "graphology-layout-noverlap"

noverlap(graph, { maxIterations: 500, settings: { gridSize, margin, expansion, ratio, speed } })
noverlap.assign(graph, options)

const layout = new NoverlapLayout(graph, options)
layout.start() / layout.stop() / layout.kill() / layout.isRunning()
```

---

## GEXF (`graphology-gexf`)

```ts
import { parse, write } from "graphology-gexf"
import { parse, write } from "graphology-gexf/browser"    // browser build

const graph = parse(Graph, gexfString, options?)
// options: { addMissingNodes, allowUndeclaredAttributes, respectInputGraphType }

const gexfString = write(graph, options?)
// options: { encoding, pretty, pedantic, version, formatNode, formatEdge }
```

---

## GraphML (`graphology-graphml`)

```ts
import { parse } from "graphology-graphml"

const graph = parse(Graph, graphmlStringOrXML, { addMissingNodes: false })
```

---

## SVG (`graphology-svg`)

Nodes must have `x`, `y`, and optionally `size`, `color`, `label`.

```ts
import render from "graphology-svg"

render(graph, "./output.svg", callback)
render(graph, "./output.svg", settings, callback)
```

---

## Canvas (`graphology-canvas`)

```ts
import { render, renderAsync, renderToPNG } from "graphology-canvas"

// Browser: render into canvas context
render(graph, context, settings?)

// Browser async (non-blocking)
renderAsync(graph, context, settings?, callback?)

// Node.js: export to PNG
renderToPNG(graph, "./output.png", settings?, callback?)

// settings: { width, height, padding, defaultNodeColor, defaultEdgeColor,
//             nodes: { reducer }, edges: { reducer } }
```

---

## Utils (`graphology-utils`)

```ts
import { isGraph, isGraphConstructor, inferMulti, inferType } from "graphology-utils"
import { mergeClique, mergeCycle, mergePath, mergeStar } from "graphology-utils/merge-clique"
import { renameGraphKeys, updateGraphKeys } from "graphology-utils/rename-graph-keys"

mergeClique(graph, nodes)               // adds complete subgraph
mergeCycle(graph, nodes)                // adds circular edges
mergePath(graph, nodes)                 // adds linear edges a→b→c
mergeStar(graph, [center, ...spokes])   // hub and spokes

renameGraphKeys(graph, nodeKeyMapping, edgeKeyMapping?): Graph
updateGraphKeys(graph, nodeKeyFn, edgeKeyFn?): Graph
```
