import { useState } from "react"
import axios from "axios"
import "./App.css"

function App() {

  const [form, setForm] = useState({
    dsa: "",
    projects: "",
    mock: "",
    hours: ""
  })

  const [result, setResult] = useState(null)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await axios.post("http://localhost:5000/api/analyze", {
      dsa: Number(form.dsa),
      projects: Number(form.projects),
      mock: Number(form.mock),
      hours: Number(form.hours)
    })

    setResult(res.data)
  }

  return (
    <div className="container">

      <div className="card">
        <h1 className="title">PrepPath AI</h1>

        <form onSubmit={handleSubmit}>
          <input className="input" name="dsa" placeholder="DSA solved" onChange={handleChange} />

          <input className="input" name="projects" placeholder="Projects" onChange={handleChange} />

          <input className="input" name="mock" placeholder="Mock interviews" onChange={handleChange} />

          <input className="input" name="hours" placeholder="Study hours" onChange={handleChange} />

          <button className="button" type="submit">Analyze</button>
        </form>

        {result && (
          <div className="result">
            <h2>Score: {result.score}</h2>

            <h3>Suggestions:</h3>
            <ul>
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  )
}

export default App