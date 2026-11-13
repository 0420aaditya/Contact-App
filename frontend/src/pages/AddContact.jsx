import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { contactUrl } from "../apiUrl"

const AddContact = () => {
    let [firstName, setFirstName] = useState("")
    let [lastName, setLastName] = useState("")
    let [email, setEmail] = useState("")
    let [phone, setPhone] = useState("")
    let [notes, setNotes] = useState("")
    let [photoFile, setPhotoFile] = useState(null)
    let [message, setMessage] = useState("")
    let navigate = useNavigate()

    const handlePhoneChange = (value) => {
        let digitsOnly = ""

        for (let i = 0; i < value.length; i++) {
            if (value[i] >= "0" && value[i] <= "9") {
                digitsOnly = digitsOnly + value[i]
            }
        }

        setPhone(digitsOnly)
    }

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
            let photoUrl = ""

            if (photoFile) {
                photoUrl = await uploadPhoto()

                if (photoUrl === "") {
                    return
                }
            }

            let token = localStorage.getItem("token")
            let response = await fetch(contactUrl, {
                method: "POST",
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
                navigate("/contacts")
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage(error.message)
        }
    }

    return (
        <Layout title="Add Contact">
            <div className="form-card">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Contact photo</label>
                        <input
                            type="file"
                            onChange={(e) => setPhotoFile(e.target.files[0])}
                        />
                        <p className="muted-text">Optional. Choose an image to upload.</p>
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
                        <button type="submit" className="primary-button">Save Contact</button>
                        <NavLink to="/contacts" className="secondary-button">Cancel</NavLink>
                    </div>

                    {message !== "" ? <p className="info-text">{message}</p> : null}
                </form>
            </div>
        </Layout>
    )
}

export default AddContact
