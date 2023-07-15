import React, { useEffect, useState } from 'react'

const App: React.FC = () => {
  const [result, setResult] = useState<string>('')

  useEffect(() => {
    async function fetchData (): Promise<void> {
      try {
        const response = await fetch('http://localhost:8080')
        const data = await response.text()
        setResult(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
      .catch((error) => { console.error(error) }
      )
  }, [])

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Graph Results</h1>
        <div className="whitespace-pre-line">{result}</div>
      </div>
    </div>
  )
}

export default App
