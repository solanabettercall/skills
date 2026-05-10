import Graph from "graphology"
import Sigma from "sigma"
import { circular } from "graphology-layout"
import forceAtlas2 from "graphology-layout-forceatlas2"

// --- Build graph ---

const graph = new Graph()

const nodes = [
  { id: "alice", label: "Alice", color: "#6A9FB5" },
  { id: "bob",   label: "Bob",   color: "#D95B43" },
  { id: "carol", label: "Carol", color: "#90B44B" },
]

for (const { id, label, color } of nodes) {
  graph.addNode(id, { label, color, size: 12, x: 0, y: 0 })
}

graph.addEdge("alice", "bob",   { size: 2 })
graph.addEdge("bob",   "carol", { size: 2 })
graph.addEdge("alice", "carol", { size: 1 })

// --- Layout ---

circular.assign(graph)
forceAtlas2.assign(graph, {
  iterations: 150,
  settings: forceAtlas2.inferSettings(graph),
})

// --- Render ---

const container = document.getElementById("sigma-container") as HTMLElement

const sigma = new Sigma(graph, container, {
  defaultNodeType: "circle",
  defaultEdgeType: "arrow",
  renderEdgeLabels: false,
  labelSize: 14,
  labelColor: { color: "#333" },
})

// --- Hover interaction with reducers ---

let hoveredNode: string | null = null
const hoveredNeighbors = new Set<string>()

sigma.on("enterNode", ({ node }) => {
  hoveredNode = node
  hoveredNeighbors.clear()
  graph.forEachNeighbor(node, (neighbor) => hoveredNeighbors.add(neighbor))
  sigma.scheduleRefresh()
})

sigma.on("leaveNode", () => {
  hoveredNode = null
  hoveredNeighbors.clear()
  sigma.scheduleRefresh()
})

sigma.setSetting("nodeReducer", (node, data) => {
  if (!hoveredNode) return data
  if (node === hoveredNode) return { ...data, highlighted: true }
  if (hoveredNeighbors.has(node)) return { ...data, color: "#e22" }
  return { ...data, color: "#ddd", label: "" }
})

sigma.setSetting("edgeReducer", (edge, data) => {
  if (!hoveredNode) return data
  if (graph.hasExtremity(edge, hoveredNode)) return data
  return { ...data, hidden: true }
})

// --- Camera ---

const camera = sigma.getCamera()

// Zoom to a specific node
function focusNode(nodeId: string) {
  const { x, y } = sigma.getNodeDisplayData(nodeId) ?? { x: 0.5, y: 0.5 }
  camera.animate({ x, y, ratio: 0.3 }, { duration: 500 })
}

// Reset view
function resetCamera() {
  camera.animate({ x: 0.5, y: 0.5, ratio: 1 }, { duration: 400 })
}

// --- Coordinate conversion ---

container.addEventListener("mousemove", (e) => {
  const rect = container.getBoundingClientRect()
  const viewport = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  const graphCoords = sigma.viewportToGraph(viewport)
  // graphCoords.x, graphCoords.y are in graph space
})

// --- Add nodes dynamically ---

function addNode(id: string, x: number, y: number, label: string) {
  graph.addNode(id, { x, y, label, size: 10, color: "#999" })
  // sigma auto-refreshes on graphology mutation
}

// --- Teardown (e.g. on component unmount) ---

function destroy() {
  sigma.kill()
}

export { sigma, graph, focusNode, resetCamera, destroy }
