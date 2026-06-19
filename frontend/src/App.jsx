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
        await axios.delete(
          `http://localhost:5000/api/senior-plan/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
          }
        )

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
  const [showEditModal, setShowEditModal] = useState(false)
  const [form, setForm] = useState({
    placed: "",
    company: "",
    preparationJourney: "",
    dsaExperience: "",
    interviewExperience: "",
    projectExperience: "",
    mockExperience: "",
    tips: ""
  })

  const [result, setResult] = useState(null)

  const [isLoggedIn, setIsLoggedIn] =
    useState(!!localStorage.getItem("token"))

  const [authMode, setAuthMode] =
    useState("login")

  const [signupData, setSignupData] =
    useState({
      name: "",
      email: "",
      password: "",
      college: "",
      branch: ""
    })

  const [showLoginPassword, setShowLoginPassword] =
    useState(false)

  const [showSignupPassword, setShowSignupPassword] =
    useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] =
    useState(false)

  console.log("RENDER:", {
    mode,
    isLoggedIn,
    token: localStorage.getItem("token")
  })

  const companies = [...new Set(seniors.map(s => s.company))]
  const resetFresherForm = () => {
    setForm((prev) => ({
      ...prev,
      dsa: "",
      projects: "",
      mock: "",
      internships: "",
      hackathons: ""
    }))
  }

  const resetSeniorForm = () => {
    setForm((prev) => ({
      ...prev,
      placed: "",
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

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!isStrongPassword(loginData.password)) {
      Swal.fire(
        "Weak Password",
        "Password format is incorrect",
        "error"
      )
      return
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData
      )

      localStorage.setItem("token", res.data.token)

      setIsLoggedIn(true)
      setMode("senior")

      // CLEAR LOGIN FORM
      setLoginData({
        email: "",
        password: ""
      })

      Swal.fire("Login Successful", "", "success")

    } catch (err) {
      Swal.fire("Error", "Invalid credentials", "error")
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!isStrongPassword(signupData.password)) {
      Swal.fire(
        "Weak Password",
        "Password must be 8+ characters, include uppercase, lowercase, number & special character",
        "error"
      )
      return
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        signupData
      )

      Swal.fire("Success", "Account created", "success")

      setAuthMode("login")

      // CLEAR FORM after signup
      setSignupData({
        name: "",
        email: "",
        password: "",
        college: "",
        branch: ""
      })

    } catch {
      Swal.fire("Error", "Signup failed", "error")
    }
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
  }
  const handleEdit = (s) => {
    setEditId(s._id)

    setForm({
      placed: s.placed || "",
      company: s.company || "",
      preparationJourney: s.preparationJourney || "",
      dsaExperience: s.dsaExperience || "",
      interviewExperience: s.interviewExperience || "",
      projectExperience: s.projectExperience || "",
      mockExperience: s.mockExperience || "",
      tips: s.tips || ""
    })

    setShowEditModal(true)
  }
  const handleSeniorSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/senior-plan/${editId}`,

          {
            placed: form.placed,
            company: form.company,
            preparationJourney: form.preparationJourney,
            dsaExperience: form.dsaExperience,
            interviewExperience: form.interviewExperience,
            projectExperience: form.projectExperience,
            mockExperience: form.mockExperience,
            tips: form.tips
          },

          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
          }
        )

        await Swal.fire({
          title: "Updated!",
          text: "Experience updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        })

        setShowEditModal(false)
        setEditId(null)
        resetSeniorForm()
      } else {
        await axios.post(
          "http://localhost:5000/api/senior-plan",

          {
            placed: form.placed,
            company: form.company,
            preparationJourney: form.preparationJourney,
            dsaExperience: form.dsaExperience,
            interviewExperience: form.interviewExperience,
            projectExperience: form.projectExperience,
            mockExperience: form.mockExperience,
            tips: form.tips
          },

          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`
            }
          }
        )

        await Swal.fire({
          title: "Success!",
          text: "Senior data added!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        })
      }

      resetSeniorForm()
      fetchSeniors()

    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error")
    }
  }
  useEffect(() => {
    fetchSeniors()
  }, [])

  const fetchSeniors = async () => {
    const res = await axios.get("http://localhost:5000/api/senior-plans")
    setSeniors(res.data)
  }

  useEffect(() => {
    console.log({
      mode,
      isLoggedIn
    })
  }, [mode, isLoggedIn])

  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)
  }

  return (

    !isLoggedIn ? (

      <div className="auth-container">

        <div className="card">

          <h1 className="title">PrepPath</h1>

          <div className="auth-switch">

            <button
              type="button"
              className={
                authMode === "login"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setAuthMode("login")
              }
            >
              Login
            </button>

            <button
              type="button"
              className={
                authMode === "signup"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setAuthMode("signup")
              }
            >
              Signup
            </button>

          </div>


          {authMode === "login" ? (

            <form onSubmit={handleLogin}>

              <input
                className="input"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value
                  })
                }
              />

              <div className="password-box">

                <input
                  type={
                    showLoginPassword
                      ? "text"
                      : "password"
                  }

                  className="input"

                  placeholder="Password"

                  value={loginData.password}

                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value
                    })
                  }
                />

                <span
                  className="eye"

                  onClick={() =>
                    setShowLoginPassword(
                      !showLoginPassword
                    )
                  }
                >

                  {showLoginPassword ? "Hide" : "View"}

                </span>

              </div>

              <button className="button">
                Login
              </button>

            </form>

          ) : (

            <form onSubmit={handleSignup}>

              <input
                className="input"
                placeholder="Name"
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    name: e.target.value
                  })
                }
              />

              <input
                className="input"
                placeholder="Email"
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    email: e.target.value
                  })
                }
              />

              <div className="password-box">

                <input
                  type={
                    showSignupPassword
                      ? "text"
                      : "password"
                  }

                  className="input"

                  placeholder="Password"

                  value={signupData.password}

                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      password: e.target.value
                    })
                  }
                />

                <span
                  className="eye"

                  onClick={() =>
                    setShowSignupPassword(
                      !showSignupPassword
                    )
                  }
                >

                  {showSignupPassword ? "Hide" : "View"}

                </span>

              </div>

              <input
                className="input"
                placeholder="College"
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    college: e.target.value
                  })
                }
              />

              <input
                className="input"
                placeholder="Branch"
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    branch: e.target.value
                  })
                }
              />

              <button className="button">
                Signup
              </button>

            </form>

          )}

        </div>

      </div>

    ) : (

      <div className="main">

        {/* LEFT SIDE */}
        <div className="left">
          <div className="card auth-card">
            <h1 className="title">
              PrepPath
            </h1>

            <p className="subtitle">
              Placement Preparation & Experience Portal
            </p>
            <div className="subtitle">

              {isLoggedIn && (
                <button
                  className="delete-btn"
                  onClick={() => {
                    localStorage.removeItem("token")

                    setIsLoggedIn(false)
                    setMode("fresher")

                    // CLEAR ALL STATE
                    setLoginData({ email: "", password: "" })
                    setSignupData({
                      name: "",
                      email: "",
                      password: "",
                      college: "",
                      branch: ""
                    })
                    setForm({})
                    setResult(null)
                    setSeniors([])
                  }}
                >
                  Logout
                </button>
              )}

              <p>
                Learn from real placement journeys and track your preparation.
              </p>

            </div>

            <div className="toggle">
              <div style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px"
              }}>
                <button
                  type="button"
                  onClick={() => setMode("fresher")}
                >
                  Fresher
                </button>

                <button
                  type="button"
                  onClick={() => setMode("senior")}
                >
                  Senior
                </button>
              </div>
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

            {mode === "senior" && !isLoggedIn && (

              <form onSubmit={handleLogin}>

                <h2>Login First</h2>

                <input
                  className="input"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      email: e.target.value
                    })
                  }
                />

                <input
                  type={showPassword ? "text" : "password"}

                  className="input"

                  placeholder="Password"

                  value={loginData.password}

                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value
                    })
                  }
                />

                <span
                  className="eye"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? "👁️" : "👁"}

                </span>

                <button
                  className="button"
                  type="submit"
                >
                  Login
                </button>

              </form>
            )}

            {mode === "senior" && isLoggedIn && (

              <form onSubmit={handleSeniorSubmit}>

                <select
                  className="input"
                  name="placed"
                  value={form.placed}
                  onChange={handleChange}>

                  <option value="">Placement Status</option>
                  <option value="placed">Placed</option>
                  <option value="not_placed">Not Placed</option>
                </select>

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
                  Share Experience
                </button>

              </form>
            )}

            {result && (
              <div className="result">

                <h2>Placement Readiness Report</h2>

                <div className="score-container">
                  <div className="score-number">{result.score}/100</div>

                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>

                  <div className="status">
                    {result.score >= 85
                      ? "🟢 Placement Ready"
                      : result.score >= 65
                        ? "🟡 Almost Ready"
                        : "🔴 Needs More Preparation"}
                  </div>
                </div>

                <div className="suggestion-box">
                  <h3>Recommendations</h3>

                  <ul>
                    {result.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

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

                    <span
                      className={
                        s.placed === "placed"
                          ? "placed-badge"
                          : "not-placed-badge"
                      }
                    >
                      {s.placed === "placed"
                        ? "Placed"
                        : "Not Placed"}
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
                    <button type="button" className="edit-btn" onClick={() => handleEdit(s)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(s._id)}>
                      Delete
                    </button>
                  </div>

                </div>
              ))}
          </div>

        </div>

        {
          showEditModal && (
            <div className="modal-overlay" onClick={() => {
              setShowEditModal(false)
              setEditId(null)
            }}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>

                <h2>Edit Experience</h2>

                <form onSubmit={handleSeniorSubmit}>

                  <select
                    className="input"
                    name="placed"
                    value={form.placed}
                    onChange={handleChange}
                  >
                    <option value="">Placement Status</option>
                    <option value="placed">Placed</option>
                    <option value="not_placed">Not Placed</option>
                  </select>

                  <input
                    className="input"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                  />

                  <textarea
                    className="textarea"
                    name="preparationJourney"
                    value={form.preparationJourney}
                    placeholder="Preparation Journey"
                    onChange={handleChange}
                  />

                  <textarea
                    className="textarea"
                    name="dsaExperience"
                    value={form.dsaExperience}
                    placeholder="DSA Experience"
                    onChange={handleChange}
                  />

                  <textarea
                    className="textarea"
                    name="interviewExperience"
                    value={form.interviewExperience}
                    placeholder="Interview Experience"
                    onChange={handleChange}
                  />

                  <textarea
                    className="textarea"
                    name="projectExperience"
                    value={form.projectExperience}
                    placeholder="Project Experience"
                    onChange={handleChange}
                  />

                  <textarea
                    className="textarea"
                    name="mockExperience"
                    value={form.mockExperience}
                    placeholder="Mock Experience"
                    onChange={handleChange}
                  />

                  <textarea
                    className="textarea"
                    name="tips"
                    value={form.tips}
                    placeholder="Tips"
                    onChange={handleChange}
                  />

                  <div className="modal-buttons">
                    <button type="submit" className="edit-btn">
                      Update
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => {
                        setShowEditModal(false)
                        setEditId(null)
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )
        }

      </div >
    )
  )
}

export default App