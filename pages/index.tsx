import React, { useEffect, useState } from 'react';
import Graph from 'react-graph-vis'

const App: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [graphData, setGraphData] = useState<any>({ nodes: [], edges: [] });
  const [graphBridge, setGraphBridge] = useState<any>({ nodes: [], edges: [] });

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);

          const response = await fetch('http://localhost:8080', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          setResult(JSON.stringify(data, null, 2));

          // Extract nodes and edges from the "graph" array
          const { graph } = data;
          const nodes = [];
          const edges = [];

          for (const edge of graph) {
            const [from, to] = edge.match(/[A-Z]/g) || [];
            if (from && to) {
              edges.push({ from, to });
              if (!nodes.includes(from)) nodes.push(from);
              if (!nodes.includes(to)) nodes.push(to);
            }
          }

          // Extract nodes and edges from the "bridge" array
          const { bridge } = data;
          const bridgeNodes = [];
          const bridgeEdges = [];

          for (const edge of bridge) {
            const [from, to] = edge.match(/[A-Z]/g) || [];
            if (from && to) {
              bridgeEdges.push({ from, to });
              if (!bridgeNodes.includes(from)) bridgeNodes.push(from);
              if (!bridgeNodes.includes(to)) bridgeNodes.push(to);
            }
          }

          const nodesData = nodes.map((node) => ({ id: node, label: node }));
          setGraphData({ nodes: nodesData, edges });

          const nodesBridgeData = bridgeNodes.map((node) => ({ id: node, label: node }));
          setGraphBridge({ nodes: nodesBridgeData, edges: bridgeEdges });
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData().catch((error) => {
      console.error(error);
    });
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    height: '500px',
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Graph Results</h1>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <pre>{result}</pre>
        {/* {graphData.nodes.length > 0 && (
          <Graph graph={graphData} options={options} events={events} />
        )}
        {graphBridge.nodes.length > 0 && (
          <Graph graph={graphBridge} options={options} events={events} />
        )} */}
      </div>
    </div>
  );
};

export default App;
