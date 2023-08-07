import React, { useEffect, useState } from 'react'
import Graph from 'react-graph-vis'

const App: React.FC = () => {
  const [result, setResult] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [graphData, setGraphData] = useState<any>({ nodes: [], edges: [] })
  const [graphBridge, setGraphBridge] = useState<any>({ nodes: [], edges: [] })
  const [graphScc, setGraphScc] = useState<any>({ nodes: [], edges: [] })
  const [exeTime, setExeTime] = useState<number>(0)

  useEffect(() => {
    async function fetchData (): Promise<void> {
      try {
        if (selectedFile) {
          const formData = new FormData()
          formData.append('file', selectedFile)

          const response = await fetch('http://localhost:8080', {
            method: 'POST',
            body: formData
          })

          const data = await response.json()
          setResult(JSON.stringify(data, null, 2))

          const { graph } = data
          const nodes = []
          const edges = []

          for (const edge of graph) {
            const [from, to] = edge.match(/[A-Z]/g) || []
            if (from && to) {
              edges.push({ from, to })
              if (!nodes.includes(from)) nodes.push(from)
              if (!nodes.includes(to)) nodes.push(to)
            }
          }

          const { bridge } = data
          const bridgeNodes = []
          const bridgeEdges = []

          for (const edge of bridge) {
            const [from, to] = edge.match(/[A-Z]/g) || []
            if (from && to) {
              bridgeEdges.push({ from, to })
              if (!bridgeNodes.includes(from)) bridgeNodes.push(from)
              if (!bridgeNodes.includes(to)) bridgeNodes.push(to)
            }
          }

          const { scc } = data
          const sccNodes = []
          const sccEdges = []

          for (const edge of scc) {
            const [from, to] = edge.match(/[A-Z]/g) || []
            if (from && to) {
              sccEdges.push({ from, to })
              if (!sccNodes.includes(from)) sccNodes.push(from)
              if (!sccNodes.includes(to)) sccNodes.push(to)
            }
          }

          const sccNodesSet = new Set(scc.map((edge) => edge.split('')))
          const sccNodesUnique = Array.from(sccNodesSet).flat()

          const nodesWithoutEdges = sccNodesUnique.filter((node) => !nodes.includes(node))

          const allNodesData = nodes.map((node) => ({ id: node, label: node }))
          const nodesWithoutEdgesData = nodesWithoutEdges.map((node) => ({
            id: node,
            label: node
          }))

          setGraphData({ nodes: allNodesData, edges })
          setGraphBridge({ nodes: bridgeNodes.map((node) => ({ id: node, label: node })), edges: bridgeEdges })
          setGraphScc({ nodes: allNodesData.concat(nodesWithoutEdgesData), edges: sccEdges })

          setExeTime(data.time)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData().catch((error) => {
      console.error(error)
    })
  }, [selectedFile])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    setSelectedFile(file)
  }

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: '#000000'
    },
    height: '500px'
  }

  const events = {
    select: function (event) {
      var { nodes, edges } = event
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full h-full">
        <div className="text-2xl font-bold mb-4">Graph Results</div>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <div style={{ display: 'flex' }} className='h-[80%]'>
          <div style={{ flex: 1 }} className='border-2'>
            <div>
              <div className='font-bold text-center'>Graph</div>
              {graphData.nodes.length > 0 && (
                <Graph graph={graphData} options={options} events={events} />
              )}
            </div>
          </div>
          <div style={{ flex: 1 }} className='border-2'>
            <div>
            <div className='font-bold text-center'>SCC</div>
              {graphScc.nodes.length > 0 && (
                <Graph graph={graphScc} options={options} events={events} />
              )}
            </div>
          </div>
          <div style={{ flex: 1 }} className='border-2'>
            <div>
              <div className='font-bold text-center'>Bridges</div>
              {graphBridge.nodes.length > 0 && (
                <Graph graph={graphBridge} options={options} events={events} />
              )}
            </div>
          </div>
        </div>
        <div>
          <div>Execution Time:</div>
          <div className='font-bold'>{exeTime} nanoseconds</div>
        </div>
      </div>
    </div>
  )
}

export default App
