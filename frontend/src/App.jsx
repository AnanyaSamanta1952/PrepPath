import { useState } from "react"
import axios from "axios"
import './App.css'

function App() {
  const [mode, setMode] = useState("fresher")
  const [form, setForm] = useState({
    dsa: "",
    projects: "",
    mock: "",
    hours: "",
    company: "",
    months: "",
    tips: ""
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
  const handleSeniorSubmit = async (e) => {
    e.preventDefault()

    await axios.post("http://localhost:5000/api/senior-plan", {
      user_id: "507f1f77bcf86cd799439011",
      company: form.company,
      months_of_preparation: Number(form.months),
      dsa_problems: Number(form.dsa),
      projects: Number(form.projects),
      mock_interviews: Number(form.mock),
      daily_hours: Number(form.hours),
      subjects: ["OS", "DBMS"],
      tips: form.tips
    })

    alert("Senior data added!")
  }

  return (
    <div className="container">

      <div className="card">
        <h1 className="title">PrepPath</h1>

        <div className="toggle">
          <button onClick={() => setMode("fresher")}>Fresher</button>
          <button onClick={() => setMode("senior")}>Senior</button>
        </div>

        {mode === "fresher" && (
          <form onSubmit={handleSubmit}>

            <input className="input" name="dsa" placeholder="DSA solved" onChange={handleChange} />
            <input className="input" name="projects" placeholder="Projects" onChange={handleChange} />
            <input className="input" name="mock" placeholder="Mock interviews" onChange={handleChange} />
            <input className="input" name="hours" placeholder="Study hours" onChange={handleChange} />

            <button className="button" type="submit">Analyze</button>
          </form>
        )}

        {mode === "senior" && (
          <form onSubmit={handleSeniorSubmit}>

            <input className="input" name="company" placeholder="Company" onChange={handleChange} />
            <input className="input" name="months" placeholder="Months of preparation" onChange={handleChange} />
            <input className="input" name="dsa" placeholder="DSA solved" onChange={handleChange} />
            <input className="input" name="projects" placeholder="Projects" onChange={handleChange} />
            <input className="input" name="mock" placeholder="Mock interviews" onChange={handleChange} />
            <input className="input" name="hours" placeholder="Daily hours" onChange={handleChange} />
            <input className="input" name="tips" placeholder="Tips" onChange={handleChange} />

            <button className="button" type="submit">Submit Experience</button>
          </form>
        )}

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