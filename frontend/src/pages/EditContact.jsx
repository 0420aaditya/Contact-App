import { useState, useEffect } from "react"
import { NavLink, useParams, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { contactUrl } from "../apiUrl"

const EditContact = () => {
    let params = useParams()
    let navigate = useNavigate()

    let [contact, setContact] = useState(null)
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState("")

    let [firstName, setFirstName] = useState("")
    let [lastName, setLastName] = useState("")
    let [email, setEmail] = useState("")
    let [phone, setPhone] = useState("")
    let [notes, setNotes] = useState("")
    let [photoFile, setPhotoFile] = useState(null)
    let [message, setMessage] = useState("")

    const handlePhoneChange = (value) => {
        let digitsOnly = ""

        for (let i = 0; i < value.length; i++) {
            if (value[i] >= "0" && value[i] <= "9") {
                digitsOnly = digitsOnly + value[i]
            }
        }

        setPhone(digitsOnly)
    }

    useEffect(() => {
        const loadContact = async () => {
            try {
                let token = localStorage.getItem("token")
                let response = await fetch(`${contactUrl}/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                let data = await response.json()

                if (data.success && data.result) {
                    setContact(data.result)
                    setFirstName(data.result.firstName)
                    setLastName(data.result.lastName)
                    setEmail(data.result.email)
                    setPhone(data.result.phone)
                    setNotes(data.result.notes)
                } else {
                    setError("Contact not found.")
                }
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadContact()
    }, [params.id])

    const uploadPhoto = async () => {
        let token = localStorage.getItem("token")
        let formData = new FormData()
        formData.append("photo", photoFile)

        let response = await fetch(`${contactUrl}/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
        let data = await response.json()

        if (data.success) {
            return data.result
        } else {
            setMessage(data.message)
            return ""
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (firstName === "" || phone === "") {
            setMessage("First name and phone are required.")
            return
        }

        try {
            let photoUrl = contact.photo ? contact.photo : ""

            if (photoFile) {
                photoUrl = await uploadPhoto()

                if (photoUrl === "") {
                    return
                }
            }

            let token = localStorage.getItem("token")
            let response = await fetch(`${contactUrl}/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    notes: notes,
                    photo: photoUrl,
                }),
            })
            let data = await response.json()

            if (data.success) {
                navigate(`/contacts/${params.id}`)
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage(error.message)
        }
    }

    if (loading) {
        return (
            <Layout title="Edit Contact">
                <p className="muted-text">Loading contact...</p>
            </Layout>
        )
    }

    if (error !== "") {
        return (
            <Layout title="Edit Contact">
                <p className="error-text">{error}</p>
                <NavLink to="/contacts" className="secondary-button">Back to Contacts</NavLink>
            </Layout>
        )
    }

    return (
        <Layout title="Edit Contact">
            <div className="form-card">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Contact photo</label>
                        <input
                            type="file"
                            onChange={(e) => setPhotoFile(e.target.files[0])}
                        />
                        <p className="muted-text">Leave empty to keep the current photo.</p>
                    </div>

                    <div className="form-field">
                        <label>First name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Last name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>Contact number</label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                        />
                        <p className="muted-text">Numbers only.</p>
                    </div>

                    <div className="form-field">
                        <label>Notes</label>
                        <textarea
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="primary-button">Update Contact</button>
                        <NavLink to={`/contacts/${contact._id}`} className="secondary-button">Cancel</NavLink>
                    </div>

                    {message !== "" ? <p className="info-text">{message}</p> : null}
                </form>
            </div>
        </Layout>
    )
}

export default EditContact
