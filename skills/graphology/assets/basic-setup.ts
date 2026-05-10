import Graph, { DirectedGraph } from "graphology"
import { circular } from "graphology-layout"
import forceAtlas2 from "graphology-layout-forceatlas2"
import { connectedComponents, largestConnectedComponentSubgraph } from "graphology-components"
import { bidirectional } from "graphology-shortest-path/unweighted"
import pagerank from "graphology-metrics/centrality/pagerank"

// --- Build graph ---

const graph = new DirectedGraph()

graph.addNode("alice", { label: "Alice", x: 0, y: 0 })
graph.addNode("bob",   { label: "Bob",   x: 0, y: 0 })
graph.addNode("carol", { label: "Carol", x: 0, y: 0 })

graph.addEdge("alice", "bob",   { weight: 1 })
graph.addEdge("bob",   "carol", { weight: 2 })
graph.addEdge("alice", "carol", { weight: 3 })

// --- Attributes ---

graph.setNodeAttribute("alice", "score", 100)
graph.updateEachNodeAttributes((node, attrs) => ({ ...attrs, visited: false }))

// --- Iteration ---

graph.forEachNode((node, attrs) => {
  console.log(node, attrs.label)
})

const heavyEdges = graph.filterEdges((edge, attrs) => attrs.weight > 1)

for (const [node, attrs] of graph.nodeEntries()) {
  console.log(node, attrs)
}

// --- Shortest path ---

const path = bidirectional(graph, "alice", "carol")
console.log("path:", path) // ["alice", "carol"] or ["alice", "bob", "carol"]

// --- Components ---

const components = connectedComponents(graph)
const biggest = largestConnectedComponentSubgraph(graph)

// --- Centrality ---

pagerank.assign(graph, { attribute: "pagerank" })
const ranked = graph.nodes().sort(
  (a, b) => graph.getNodeAttribute(b, "pagerank") - graph.getNodeAttribute(a, "pagerank")
)
console.log("top node:", ranked[0])

// --- Layout ---

// 1. Seed positions
circular.assign(graph)

// 2. Run ForceAtlas2
const settings = forceAtlas2.inferSettings(graph)
forceAtlas2.assign(graph, { iterations: 100, settings })

// Read positions
graph.forEachNode((node) => {
  const x = graph.getNodeAttribute(node, "x")
  const y = graph.getNodeAttribute(node, "y")
  console.log(node, { x, y })
})

// --- Serialization ---

const data = graph.export()
const copy = Graph.from(data)

// --- Events ---

graph.on("nodeAdded", ({ key, attributes }) => {
  console.log("added:", key, attributes)
})

graph.on("edgeDropped", ({ key }) => {
  console.log("removed edge:", key)
})

export { graph }
