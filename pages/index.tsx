import React, { useEffect, useState, useRef } from 'react';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

const App: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const graphContainerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (graphContainerRef.current) {
      const container = graphContainerRef.current;
      const options = {
        height: '400px',
        width: '100%',
        edges: {
          arrows: {
            to: {
              enabled: true,
            },
          },
        },
      };
      networkRef.current = new Network(container, {}, options);
    }
  }, []);

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
          setResult(data.result);

          if (networkRef.current && data.graph) {
            const graphData = createGraphData(data.graph);
            networkRef.current.setData(graphData);
          }
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

  const createGraphData = (graph) => {
    const nodes = new DataSet(graph.nodes.map((node) => ({ id: node.ID, label: node.Label })));

    // Create an array of edges from the graph data
    const edgesArray = graph.edges.map((edge) => ({ from: edge.From, to: edge.To }));

    const edges = new DataSet(edgesArray);
    return { nodes, edges };
  };  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Graph Results</h1>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <pre>{result}</pre>
        <div className="graph-container" ref={graphContainerRef}></div>
      </div>
    </div>
  );
};

export default App;
