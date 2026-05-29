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
    company: "",
    preparationJourney: "",
    dsaExperience: "",
    interviewExperience: "",
    projectExperience: "",
    mockExperience: "",
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
      preparationJourney: "",
      dsaExperience: "",
      interviewExperience: "",
      projectExperience: "",
      mockExperience: "",
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
      internships: Number(form.internships),
      hackathons: Number(form.hackathons)
    })

    setResult(res.data)
    resetFresherForm()
  }
  const handleEdit = (s) => {
    setMode("senior")
    setEditId(s._id)

    setForm({
      company: s.company || "",
      preparationJourney: s.preparationJourney || "",
      dsaExperience: s.dsaExperience || "",
      interviewExperience: s.interviewExperience || "",
      projectExperience: s.projectExperience || "",
      mockExperience: s.mockExperience || "",
      tips: s.tips || ""
    })
  }
  const handleSeniorSubmit = async (e) => {
    e.preventDefault()

    if (editId) {
      // UPDATE
      await axios.put(`http://localhost:5000/api/senior-plan/${editId}`, {
        company: form.company,
        preparationJourney: form.preparationJourney,
        dsaExperience: form.dsaExperience,
        interviewExperience: form.interviewExperience,
        projectExperience: form.projectExperience,
        mockExperience: form.mockExperience,
        tips: form.tips
      })

    } else {
      // CREATE
      await axios.post("http://localhost:5000/api/senior-plan", {
        company: form.company,
        preparationJourney: form.preparationJourney,
        dsaExperience: form.dsaExperience,
        interviewExperience: form.interviewExperience,
        projectExperience: form.projectExperience,
        mockExperience: form.mockExperience,
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
          <p className="subtitle">
            Learn from real placement journeys and track your preparation.
          </p>

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
              <input className="input" name="internships" value={form.internships} placeholder="Internships" onChange={handleChange} />
              <input className="input" name="hackathons" value={form.hackathons} placeholder="Hackathons participated" onChange={handleChange} />

              <button className="button" type="submit">Analyze</button>
            </form>
          )}

          {mode === "senior" && (
            <form onSubmit={handleSeniorSubmit}>

              <input
                className="input"
                name="company"
                value={form.company}
                placeholder="Company"
                onChange={handleChange}
              />

              <textarea
                className="textarea"
                name="preparationJourney"
                value={form.preparationJourney}
                placeholder="How did you prepare? DSA, timeline, resources etc."
                onChange={handleChange}
              />

              <textarea
                className="textarea"
                name="dsaExperience"
                value={form.dsaExperience}
                placeholder="How many DSA questions did you solve? Which topics were important?"
                onChange={handleChange}
              />

              <textarea
                className="textarea"
                name="interviewExperience"
                value={form.interviewExperience}
                placeholder="How were the interview rounds? What questions were asked?"
                onChange={handleChange}
              />

              <textarea
                className="textarea"
                name="projectExperience"
                value={form.projectExperience}
                placeholder="What projects did you build?"
                onChange={handleChange}
              />

              <textarea
                className="textarea"
                name="mockExperience"
                value={form.mockExperience}
                placeholder="Mock interviews, contests, hackathons, internships etc."
                onChange={handleChange}
              />

              <textarea
                className="textarea"
                name="tips"
                value={form.tips}
                placeholder="Advice for juniors"
                onChange={handleChange}
              />

              <button className="button" type="submit">
                {editId ? "Update Experience" : "Share Experience"}
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

                <div className="card-header">
                  <div>
                    <h3 className="company-name">{s.company}</h3>
                    <p className="posted-text">Shared Placement Experience</p>
                  </div>

                  <span className="experience-badge">
                    Experience
                  </span>
                </div>

                <div className="section">
                  <h4>Preparation Journey</h4>
                  <p>{s.preparationJourney}</p>
                </div>

                <div className="section">
                  <h4>DSA Preparation</h4>
                  <p>{s.dsaExperience}</p>
                </div>

                <div className="section">
                  <h4>Interview Rounds</h4>
                  <p>{s.interviewExperience}</p>
                </div>

                <div className="section">
                  <h4>Projects Built</h4>
                  <p>{s.projectExperience}</p>
                </div>

                <div className="section">
                  <h4>Mocks / Internships / Hackathons</h4>
                  <p>{s.mockExperience}</p>
                </div>

                <div className="tips-box">
                  <h4>Advice for Juniors</h4>
                  <p>{s.tips}</p>
                </div>

                <div className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(s)}>
                    Edit
                  </button>

                  <button className="delete-btn" onClick={() => handleDelete(s._id)}>
                    Delete
                  </button>
                </div>

              </div>
            ))}
        </div>

      </div>

    </div >
  )
}

export default App