import axios from "axios"
import { useState, useEffect } from "react"
import './App.css'
import Swal from "sweetalert2"
import "animate.css"

function App() {
  const handleDelete = async (id) => {


    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",

      showClass: {
        popup: "animate__animated animate__fadeInDown"
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp"
      }
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/senior-plan/${id}`)

        await Swal.fire(
          "Deleted!",
          "Your experience has been deleted.",
          "success"
        )

        fetchSeniors()
      } catch (error) {
        Swal.fire("Error", "Something went wrong", "error")
      }
    }
  }

  const [companyFilter, setCompanyFilter] = useState("")
  const [seniors, setSeniors] = useState([])
  const [mode, setMode] = useState("fresher")
  const [editId, setEditId] = useState(null)
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
  const resetFresherForm = () => {
    setForm((prev) => ({
      ...prev,
      dsa: "",
      projects: "",
      mock: ""
    }))
  }

  const resetSeniorForm = () => {
    setForm((prev) => ({
      ...prev,
      company: "",
      months: "",
      dsa: "",
      projects: "",
      mock: "",
      tips: ""
    }))
  }

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
    resetFresherForm()
  }
  const handleEdit = (s) => {
    setMode("senior")
    setEditId(s._id)

    setForm({
      dsa: s.dsa_problems,
      projects: s.projects,
      mock: s.mock_interviews,
      company: s.company,
      months: s.months_of_preparation,
      tips: s.tips
    })
  }
  const handleSeniorSubmit = async (e) => {
    e.preventDefault()

    if (editId) {
      // UPDATE
      await axios.put(`http://localhost:5000/api/senior-plan/${editId}`, {
        company: form.company,
        months_of_preparation: Number(form.months),
        dsa_problems: Number(form.dsa),
        projects: Number(form.projects),
        mock_interviews: Number(form.mock),
        tips: form.tips
      })

    } else {
      // CREATE
      await axios.post("http://localhost:5000/api/senior-plan", {
        user_id: "507f1f77bcf86cd799439011",
        company: form.company,
        months_of_preparation: Number(form.months),
        dsa_problems: Number(form.dsa),
        projects: Number(form.projects),
        mock_interviews: Number(form.mock),
        tips: form.tips
      })

      await Swal.fire({
        title: "Success!",
        text: editId ? "Updated successfully!" : "Senior data added!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      })
    }

    setEditId(null)
    resetSeniorForm()
    fetchSeniors()
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
            <button onClick={() => {
              setMode("fresher")
              resetSeniorForm()   // clear senior fields
              setResult(null)
            }}>
              Fresher
            </button>

            <button onClick={() => {
              setMode("senior")
              resetFresherForm()  // clear fresher fields
            }}>
              Senior
            </button>
          </div>

          {mode === "fresher" && (
            <form onSubmit={handleSubmit}>
              <input className="input" name="dsa" value={form.dsa} placeholder="DSA solved" onChange={handleChange} />
              <input className="input" name="projects" value={form.projects} placeholder="Projects" onChange={handleChange} />
              <input className="input" name="mock" value={form.mock} placeholder="Mock interviews" onChange={handleChange} />

              <button className="button" type="submit">Analyze</button>
            </form>
          )}

          {mode === "senior" && (
            <form onSubmit={handleSeniorSubmit}>
              <input className="input" name="company" value={form.company} placeholder="Company" onChange={handleChange} />
              <input className="input" name="months" value={form.months} placeholder="Months of preparation" onChange={handleChange} />
              <input className="input" name="dsa" value={form.dsa} placeholder="DSA solved" onChange={handleChange} />
              <input className="input" name="projects" value={form.projects} placeholder="Projects" onChange={handleChange} />
              <input className="input" name="mock" value={form.mock} placeholder="Mock interviews" onChange={handleChange} />
              <input className="input" name="tips" value={form.tips} placeholder="Tips" onChange={handleChange} />

              <button className="button" type="submit">
                {editId ? "Update Experience" : "Submit Experience"}
              </button>
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

                <p>💡 {s.tips}</p>
                <div className="actions">
                  <button onClick={() => handleEdit(s)}>Edit</button>
                  <button onClick={() => handleDelete(s._id)}>Delete</button>
                </div>
              </div>
            ))}
        </div>

      </div>

    </div>
  )
}

export default App