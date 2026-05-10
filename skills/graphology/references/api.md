# Graphology — API cheatsheet

Quick reference for the core `Graph` class. All methods throw informative errors on invalid input.

---

## Instantiation

```ts
new Graph(options?)
new DirectedGraph(options?)
new UndirectedGraph(options?)
new MultiGraph(options?)
new MultiDirectedGraph(options?)
new MultiUndirectedGraph(options?)
Graph.from(data | graph)
```

**Options:** `type` (`"directed"|"undirected"|"mixed"`), `multi` (boolean), `allowSelfLoops` (boolean)

---

## Properties (read-only)

| Property | Type | Description |
|---|---|---|
| `graph.order` | number | Node count |
| `graph.size` | number | Edge count |
| `graph.type` | string | `"directed"`, `"undirected"`, or `"mixed"` |
| `graph.multi` | boolean | Parallel edges allowed |
| `graph.allowSelfLoops` | boolean | Self-loops allowed |
| `graph.selfLoopCount` | number | Number of self-loop edges |
| `graph.implementation` | string | Implementation identifier |

---

## Mutation — Nodes

| Method | Returns | Notes |
|---|---|---|
| `addNode(key, attrs?)` | key | Throws if key exists |
| `mergeNode(key, attrs?)` | `[key, wasCreated]` | Merges attrs if exists |
| `updateNode(key, updater)` | `[key, wasCreated]` | updater: `(attrs) => newAttrs` |
| `dropNode(key)` | void | Removes incident edges |

## Mutation — Edges

| Method | Returns | Notes |
|---|---|---|
| `addEdge(source, target, attrs?)` | key | Auto-generated key |
| `addEdgeWithKey(key, source, target, attrs?)` | key | Explicit key |
| `addDirectedEdge(source, target, attrs?)` | key | |
| `addUndirectedEdge(source, target, attrs?)` | key | |
| `mergeEdge(source, target, attrs?)` | `[key, wasCreated, ...]` | |
| `mergeEdgeWithKey(key, source, target, attrs?)` | `[key, wasCreated, ...]` | |
| `mergeDirectedEdge(source, target, attrs?)` | `[key, wasCreated, ...]` | |
| `mergeUndirectedEdge(source, target, attrs?)` | `[key, wasCreated, ...]` | |
| `updateEdge(source, target, updater)` | `[key, wasCreated, ...]` | |
| `updateEdgeWithKey(key, source, target, updater)` | `[key, wasCreated, ...]` | |
| `dropEdge(key \| source, target)` | void | |
| `clear()` | void | Removes all nodes and edges |
| `clearEdges()` | void | Removes edges, keeps nodes |

---

## Read — Existence

```ts
graph.hasNode(key): boolean
graph.hasEdge(key): boolean
graph.hasEdge(source, target): boolean
graph.hasDirectedEdge(source, target): boolean
graph.hasUndirectedEdge(source, target): boolean
```

## Read — Degree

```ts
graph.degree(key): number
graph.degreeWithoutSelfLoops(key): number
graph.inDegree(key): number
graph.inDegreeWithoutSelfLoops(key): number
graph.outDegree(key): number
graph.outDegreeWithoutSelfLoops(key): number
graph.directedDegree(key): number
graph.undirectedDegree(key): number
```

## Read — Edge info

```ts
graph.edge(source, target): key           // throws on multigraph
graph.source(edge): key
graph.target(edge): key
graph.extremities(edge): [source, target]
graph.opposite(node, edge): key           // other endpoint
graph.isDirected(edge): boolean
graph.isSelfLoop(edge): boolean
graph.hasExtremity(edge, node): boolean
```

## Read — Neighborhood

```ts
graph.areNeighbors(a, b): boolean
graph.areDirectedNeighbors(a, b): boolean
graph.areUndirectedNeighbors(a, b): boolean
graph.areInNeighbors(a, b): boolean
graph.areOutNeighbors(a, b): boolean
```

---

## Attributes — Graph

```ts
graph.getAttribute(name)
graph.getAttributes()
graph.hasAttribute(name): boolean
graph.setAttribute(name, value)
graph.updateAttribute(name, updater)      // updater: (value) => newValue
graph.removeAttribute(name)
graph.replaceAttributes(attrs)
graph.mergeAttributes(attrs)
graph.updateAttributes(updater)           // updater: (attrs) => newAttrs
```

## Attributes — Nodes

```ts
graph.getNodeAttribute(node, name)
graph.getNodeAttributes(node)
graph.hasNodeAttribute(node, name): boolean
graph.setNodeAttribute(node, name, value)
graph.updateNodeAttribute(node, name, updater)
graph.removeNodeAttribute(node, name)
graph.replaceNodeAttributes(node, attrs)
graph.mergeNodeAttributes(node, attrs)
graph.updateNodeAttributes(node, updater)
graph.updateEachNodeAttributes(updater, hints?)
// updater: (node, attrs) => newAttrs

// Convenience: access via edge endpoint
graph.getSourceNodeAttribute(edge, name)
graph.getTargetNodeAttribute(edge, name)
graph.getOppositeNodeAttribute(edge, node, name)
```

## Attributes — Edges

```ts
// All accept (edgeKey, name) or (source, target, name)
graph.getEdgeAttribute(edge, name)
graph.getEdgeAttributes(edge)
graph.hasEdgeAttribute(edge, name): boolean
graph.setEdgeAttribute(edge, name, value)
graph.updateEdgeAttribute(edge, name, updater)
graph.removeEdgeAttribute(edge, name)
graph.replaceEdgeAttributes(edge, attrs)
graph.mergeEdgeAttributes(edge, attrs)
graph.updateEdgeAttributes(edge, updater)
graph.updateEachEdgeAttributes(updater, hints?)
// updater: (edge, attrs, source, target) => newAttrs
```

---

## Iteration methods (× 3 collections)

Each collection (`Node`, `Edge`, `Neighbor`) exposes these 9 methods. Edge/neighbor methods accept an optional node filter argument.

| Method | Signature |
|---|---|
| `#.nodes()` | `() => string[]` |
| `#.forEachNode()` | `(cb: (node, attrs) => void) => void` |
| `#.mapNodes()` | `(cb: (node, attrs) => T) => T[]` |
| `#.filterNodes()` | `(cb: (node, attrs) => bool) => string[]` |
| `#.reduceNodes()` | `(cb, initial) => T` |
| `#.findNode()` | `(cb: (node, attrs) => bool) => string \| undefined` |
| `#.someNode()` | `(cb) => boolean` |
| `#.everyNode()` | `(cb) => boolean` |
| `#.nodeEntries()` | `() => IterableIterator<[node, attrs]>` |

**Edge variants:** `edges`, `inEdges`, `outEdges`, `directedEdges`, `undirectedEdges` — each takes optional `(node)` or `(source, target)`

**Neighbor variants:** `neighbors`, `inNeighbors`, `outNeighbors`, `directedNeighbors`, `undirectedNeighbors`

---

## Serialization

```ts
graph.export(): SerializedGraph
// { attributes, nodes: [{key, attributes}], edges: [{key, source, target, attributes, undirected}] }

graph.import(data: SerializedGraph | Graph, merge?: boolean): void
Graph.from(data | graph): Graph

graph.copy(): Graph           // shallow clone
graph.emptyCopy(): Graph      // clone options, no data
graph.toJSON(): SerializedGraph
graph.inspect(): string       // pretty-print for debugging
```

---

## Events

| Event | Payload |
|---|---|
| `nodeAdded` | `{ key, attributes }` |
| `edgeAdded` | `{ key, source, target, attributes, undirected }` |
| `nodeDropped` | `{ key, attributes }` |
| `edgeDropped` | `{ key, source, target, attributes, undirected }` |
| `cleared` | — |
| `edgesCleared` | — |
| `attributesUpdated` | `{ type, attributes, name?, value? }` |
| `nodeAttributesUpdated` | `{ key, type, attributes, name?, value? }` |
| `edgeAttributesUpdated` | `{ key, type, attributes, name?, value? }` |
| `eachNodeAttributesUpdated` | `{ hints }` |
| `eachEdgeAttributesUpdated` | `{ hints }` |
