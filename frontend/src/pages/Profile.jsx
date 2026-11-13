import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import Layout from "../components/Layout"
import { authUrl } from "../apiUrl"

const Profile = () => {
    let navigate = useNavigate()

    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState("")

    let [editMode, setEditMode] = useState(false)
    let [nameInput, setNameInput] = useState("")
    let [profileMessage, setProfileMessage] = useState("")
    let [profileError, setProfileError] = useState("")

    let [currentPassword, setCurrentPassword] = useState("")
    let [newPassword, setNewPassword] = useState("")
    let [confirmPassword, setConfirmPassword] = useState("")
    let [showCurrentPassword, setShowCurrentPassword] = useState(false)
    let [showNewPassword, setShowNewPassword] = useState(false)
    let [showConfirmPassword, setShowConfirmPassword] = useState(false)
    let [passwordMessage, setPasswordMessage] = useState("")
    let [passwordError, setPasswordError] = useState("")

    useEffect(() => {
        const loadProfile = async () => {
            try {
                let token = localStorage.getItem("token")
                let response = await fetch(`${authUrl}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                let data = await response.json()

                if (data.success) {
                    setName(data.result.name)
                    setEmail(data.result.email)
                    setNameInput(data.result.name)
                } else {
                    setError(data.message)
                }
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [])

    const handleEdit = () => {
        setNameInput(name)
        setProfileMessage("")
        setProfileError("")
        setEditMode(true)
    }

    const handleCancel = () => {
        setNameInput(name)
        setProfileError("")
        setEditMode(false)
    }

    const handleSaveName = async (e) => {
        e.preventDefault()

        if (nameInput.trim() === "") {
            setProfileError("Username cannot be empty.")
            return
        }

        try {
            let token = localStorage.getItem("token")
            let response = await fetch(`${authUrl}/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: nameInput }),
            })
            let data = await response.json()

            if (data.success) {
                setName(data.result.name)
                setNameInput(data.result.name)
                localStorage.setItem("name", data.result.name)
                setProfileMessage("Profile updated successfully.")
                setProfileError("")
                setEditMode(false)
            } else {
                setProfileError(data.message)
            }
        } catch (error) {
            setProfileError(error.message)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (currentPassword === "" || newPassword === "" || confirmPassword === "") {
            setPasswordError("All password fields are required.")
            setPasswordMessage("")
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New password and confirm password do not match.")
            setPasswordMessage("")
            return
        }

        if (newPassword === currentPassword) {
            setPasswordError("New password must be different from the current password.")
            setPasswordMessage("")
            return
        }

        try {
            let token = localStorage.getItem("token")
            let response = await fetch(`${authUrl}/change-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                }),
            })
            let data = await response.json()

            if (data.success) {
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
                setPasswordError("")
                setPasswordMessage(data.message)

                localStorage.removeItem("token")
                localStorage.removeItem("name")

                setTimeout(() => {
                    navigate("/login")
                }, 1500)
            } else {
                setPasswordError(data.message)
                setPasswordMessage("")
            }
        } catch (error) {
            setPasswordError(error.message)
        }
    }

    if (loading) {
        return (
            <Layout title="Profile">
                <p className="muted-text">Loading profile...</p>
            </Layout>
        )
    }

    if (error !== "") {
        return (
            <Layout title="Profile">
                <p className="error-text">{error}</p>
            </Layout>
        )
    }

    let initial = name ? name[0].toUpperCase() : "A"

    return (
        <Layout title="Profile">
            <div className="profile-grid">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar-large">{initial}</div>
                        <div>
                            <h2>{name}</h2>
                            <p className="muted-text">{email}</p>
                        </div>
                    </div>

                    {
                        editMode
                            ? <form className="form" onSubmit={handleSaveName}>
                                <div className="form-field">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                    />
                                </div>

                                {profileError !== "" ? <p className="error-text">{profileError}</p> : null}

                                <div className="form-actions">
                                    <button type="submit" className="primary-button">Save Changes</button>
                                    <button type="button" className="secondary-button" onClick={handleCancel}>Cancel</button>
                                </div>
                            </form>
                            : <div>
                                <div className="profile-field">
                                    <span className="label">Username</span>
                                    <p>{name}</p>
                                </div>

                                <div className="profile-field">
                                    <span className="label">Email</span>
                                    <p>{email}</p>
                                </div>

                                {profileMessage !== "" ? <p className="success-text">{profileMessage}</p> : null}

                                <button className="primary-button" onClick={handleEdit}>Edit Profile</button>
                            </div>
                    }
                </div>

                <div className="profile-card">
                    <h2 className="profile-section-title">Change Password</h2>

                    <form className="form" onSubmit={handleChangePassword}>
                        <div className="form-field">
                            <label>Current Password</label>
                            <div className="password-field">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    title={showCurrentPassword ? "Hide password" : "Show password"}
                                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>New Password</label>
                            <div className="password-field">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    title={showNewPassword ? "Hide password" : "Show password"}
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Confirm New Password</label>
                            <div className="password-field">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    title={showConfirmPassword ? "Hide password" : "Show password"}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {passwordError !== "" ? <p className="error-text">{passwordError}</p> : null}
                        {passwordMessage !== "" ? <p className="success-text">{passwordMessage}</p> : null}

                        <button type="submit" className="primary-button">Change Password</button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Profile
