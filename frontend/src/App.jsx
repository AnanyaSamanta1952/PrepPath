import axios from "axios"
import { useState, useEffect } from "react"
import './App.css'

function App() {
  const [companyFilter, setCompanyFilter] = useState("")
  const [seniors, setSeniors] = useState([])
  const [mode, setMode] = useState("fresher")
  const [form, setForm] = useState({
    dsa: "",
    projects: "",
    mock: "",
    company: "",
    months: "",
    tips: ""
  })

  const [result, setResult] = useState(null)
  const companies = [...new Set(seniors.map(s => s.company))]

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
      subjects: form.subjects?.split(","),
      tips: form.tips
    })

    alert("Senior data added!")
  }

  useEffect(() => {
    fetchSeniors()
  }, [])

  const fetchSeniors = async () => {
    const res = await axios.get("http://localhost:5000/api/senior-plans")
    setSeniors(res.data)
  }

  return (
    <div className="main">

      {/* LEFT SIDE */}
      <div className="left">
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
              <input className="input" name="subjects" placeholder="Subjects (comma separated)" onChange={handleChange} />
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

      {/* RIGHT SIDE */}
      <div className="right">

        <select
          className="input"
          onChange={(e) => setCompanyFilter(e.target.value)}
        >
          <option value="">All Companies</option>

          {companies.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <div className="experience-section">
          <h2>Interview Experiences</h2>

          {seniors
            .filter((s) =>
              companyFilter === "" || s.company?.toLowerCase() === companyFilter.toLowerCase()
            )
            .map((s, i) => (
              <div key={i} className="experience-card">
                <h3>🏢 {s.company}</h3>

                <p>
                  📊 {s.dsa_problems} DSA | {s.projects} Projects | {s.mock_interviews} Mocks
                </p>

                <p>📚 {s.subjects?.join(", ")}</p>

                <p>💡 {s.tips}</p>
              </div>
            ))}
        </div>

      </div>

    </div>
  )
}

export default App