import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Graph Results</h1>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default App;