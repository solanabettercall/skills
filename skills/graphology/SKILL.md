---
name: graphology
description: Work with graphs in JavaScript/TypeScript using Graphology. Use when building or querying graph structures (nodes, edges, attributes), running graph algorithms (BFS/DFS, shortest path, community detection, centrality), applying layouts (ForceAtlas2, force, circular), or importing/exporting GEXF/GraphML files.
license: MIT
metadata:
  author: solanabettercall
  version: "1.0"
compatibility: Node.js and browser. Standard library packages are independent npm installs.
---

# Graphology

Graphology is a multiplex graph library for JavaScript/TypeScript. Graphs are mutable objects; nodes and edges are identified by string keys and carry arbitrary attribute objects.

## Install

```bash
npm install graphology
```

## Instantiation

```ts
import Graph from "graphology"

// Defaults: mixed (directed + undirected), simple (no parallel edges), self-loops allowed
const graph = new Graph()

// Specialized constructors — faster and type-safe
import { DirectedGraph, UndirectedGraph, MultiGraph, MultiDirectedGraph, MultiUndirectedGraph } from "graphology"

const directed = new DirectedGraph()
const multi    = new MultiGraph()           // parallel edges allowed

// From serialized data
const g = Graph.from({ nodes: [...], edges: [...], attributes: {} })

// Options
const g2 = new Graph({ type: "directed", multi: false, allowSelfLoops: true })
```

## Mutation

```ts
// Nodes
graph.addNode("alice", { age: 30, role: "admin" })
graph.mergeNode("alice", { age: 31 })          // add or merge attrs
graph.updateNode("alice", (attrs) => ({ ...attrs, age: attrs.age + 1 }))
graph.dropNode("alice")                         // removes incident edges too

// Directed edges
graph.addEdge("alice", "bob", { weight: 5 })          // auto key
graph.addEdgeWithKey("e1", "alice", "bob", { weight: 5 })
graph.mergeEdge("alice", "bob", { weight: 5 })        // add or merge
graph.updateEdge("alice", "bob", (attrs) => ({ ...attrs, weight: attrs.weight + 1 }))
graph.dropEdge("e1")

// Undirected
graph.addUndirectedEdge("alice", "bob")
graph.addUndirectedEdgeWithKey("e2", "alice", "bob")
graph.mergeUndirectedEdge("alice", "bob")

// Clear
graph.clear()                  // remove everything
graph.clearEdges()             // keep nodes
```

## Read

```ts
// Existence
graph.hasNode("alice")                  // boolean
graph.hasEdge("e1")                     // by key
graph.hasEdge("alice", "bob")           // by endpoints

// Degree
graph.degree("alice")                   // in + out + undirected
graph.inDegree("alice")
graph.outDegree("alice")
graph.undirectedDegree("alice")
graph.directedDegree("alice")

// Edge info
graph.edge("alice", "bob")              // key (throws on multigraph)
graph.source("e1")
graph.target("e1")
graph.extremities("e1")                 // [source, target]
graph.opposite("alice", "e1")          // other endpoint
graph.isDirected("e1")
graph.isSelfLoop("e1")

// Neighborhood
graph.areNeighbors("alice", "bob")
graph.areInNeighbors("alice", "bob")
graph.areOutNeighbors("alice", "bob")

// Counts
graph.order    // node count
graph.size     // edge count
```

## Attributes

```ts
// Node attributes
graph.getNodeAttribute("alice", "age")
graph.getNodeAttributes("alice")                   // full object
graph.hasNodeAttribute("alice", "age")
graph.setNodeAttribute("alice", "age", 31)
graph.updateNodeAttribute("alice", "age", (v) => v + 1)
graph.removeNodeAttribute("alice", "age")
graph.replaceNodeAttributes("alice", { age: 31 })
graph.mergeNodeAttributes("alice", { role: "user" })
graph.updateEachNodeAttributes((node, attrs) => ({ ...attrs, visited: false }))

// Edge attributes (by key or by endpoints)
graph.getEdgeAttribute("e1", "weight")
graph.getEdgeAttribute("alice", "bob", "weight")   // throws on multigraph
graph.setEdgeAttribute("e1", "weight", 10)
graph.updateEachEdgeAttributes((edge, attrs) => ({ ...attrs, weight: 1 }))

// Graph-level attributes
graph.getAttribute("name")
graph.setAttribute("name", "My Graph")
graph.getAttributes()
graph.mergeAttributes({ version: 2 })
```

## Iteration

Every collection supports 9 methods: `nodes/edges/neighbors`, `forEachNode/Edge/Neighbor`, `mapNodes/Edges/Neighbors`, `filterNodes/Edges/Neighbors`, `reduceNodes/Edges/Neighbors`, `findNode/Edge/Neighbor`, `someNode/Edge/Neighbor`, `everyNode/Edge/Neighbor`, `nodeEntries/edgeEntries/neighborEntries`.

```ts
// Nodes
const keys = graph.nodes()
graph.forEachNode((node, attrs) => { /* ... */ })
const labels = graph.mapNodes((node, attrs) => attrs.label)
const admins = graph.filterNodes((node, attrs) => attrs.role === "admin")

// Edges (filter by node)
graph.edges()                          // all edges
graph.edges("alice")                   // incident to alice
graph.edges("alice", "bob")            // between alice and bob
graph.inEdges("alice")
graph.outEdges("alice")
graph.undirectedEdges("alice")

graph.forEachEdge("alice", (edge, attrs, source, target) => { /* ... */ })

// Neighbors
graph.neighbors("alice")
graph.inNeighbors("alice")
graph.outNeighbors("alice")
graph.forEachNeighbor("alice", (neighbor, attrs) => { /* ... */ })

// Iterators
for (const [node, attrs] of graph.nodeEntries()) { /* ... */ }
for (const [edge, attrs, source, target] of graph.edgeEntries()) { /* ... */ }
```

## Events

```ts
graph.on("nodeAdded",   ({ key, attributes }) => { })
graph.on("edgeAdded",   ({ key, source, target, attributes, undirected }) => { })
graph.on("nodeDropped", ({ key, attributes }) => { })
graph.on("edgeDropped", ({ key, source, target, attributes, undirected }) => { })
graph.on("cleared",     () => { })
graph.on("edgesCleared",() => { })
graph.on("nodeAttributesUpdated", ({ key, type, attributes, name, value }) => { })
graph.on("edgeAttributesUpdated", ({ key, type, attributes, name, value }) => { })
graph.on("eachNodeAttributesUpdated", ({ hints }) => { })
graph.on("eachEdgeAttributesUpdated", ({ hints }) => { })
```

## Serialization

```ts
// Export — produces plain object
const data = graph.export()
// { attributes: {}, nodes: [{key, attributes}], edges: [{key, source, target, attributes, undirected}] }

// Import — from plain object or another Graph instance
graph.import(data)
graph.import(otherGraph)
graph.import(data, true)  // merge instead of overwrite

// Round-trip
const copy = Graph.from(graph.export())
```

## TypeScript generics

```ts
type NodeAttrs = { label: string; x: number; y: number }
type EdgeAttrs = { weight: number }
type GraphAttrs = { name: string }

const graph = new Graph<NodeAttrs, EdgeAttrs, GraphAttrs>()
```

## Gotchas

- **Keys are strings** — numbers and objects are coerced: `graph.addNode(1)` → key is `"1"`.
- **`#.edge(source, target)` throws on multigraphs** — use `#.edges(source, target)` instead to get an array.
- **`#.addEdge` returns the generated key**, not the graph — don't use it for chaining.
- **`dropNode` removes all incident edges** — no orphaned edges.
- **Insertion order is stable but not guaranteed** — don't rely on it across modifications.
- **`mergeEdge` on a directed graph matches direction** — `mergeEdge("a","b")` and `mergeEdge("b","a")` create two separate edges.
- **Undirected edge `source`/`target`** reflect insertion order, not semantics.

## Reference

- [API cheatsheet](references/api.md) — all methods with signatures at a glance
- [Standard library](references/stdlib.md) — algorithms, layouts, formats overview
- [Boilerplate](assets/basic-setup.ts) — TypeScript starter with common operations

### Official docs

- [API reference](https://graphology.github.io/)
- [Standard library](https://graphology.github.io/standard-library/)
