import { useEffect, useState } from "react"
import "./App.css"

function App() {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    fetch("/api")
      .then((res) => res.text())
      .then(setGreeting)
  }, [])

  return (
    <div style={{ backgroundColor: "red" }}>
      <h1>{greeting}</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
