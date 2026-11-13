import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { authUrl } from "../apiUrl"

const Login = () => {
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [showPassword, setShowPassword] = useState(false)
    let [error, setError] = useState("")
    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (email === "" || password === "") {
            setError("Email and password are required.")
            return
        }

        try {
            let response = await fetch(`${authUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })
            let data = await response.json()

            if (data.success) {
                localStorage.setItem("token", data.result.token)
                localStorage.setItem("name", data.result.name)
                navigate("/dashboard")
            } else {
                setError(data.message)
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Contact Manager</h1>
                <p className="muted-text">Sign in to manage your contacts.</p>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Password</label>
                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                title={showPassword ? "Hide password" : "Show password"}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {error !== "" ? <p className="error-text">{error}</p> : null}

                    <button type="submit" className="primary-button">Login</button>
                </form>

                <p className="muted-text">Use the account you registered through the API.</p>
            </div>
        </div>
    )
}

export default Login
