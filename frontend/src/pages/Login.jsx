import { useState } from "react"
import axios from "axios"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()

        try {

            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            )

            localStorage.setItem(
                "token",
                res.data.token
            )

            alert("Login Successful")

        } catch (err) {

            alert(err.response?.data?.message)
        }
    }

    return (

        <div className="card">

            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <input
                    className="input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button className="button">
                    Login
                </button>

            </form>

        </div>
    )
}

export default Login