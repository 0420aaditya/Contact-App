import { useState, useEffect } from "react"
import { NavLink, useParams, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import ConfirmDelete from "../components/ConfirmDelete"
import { contactUrl } from "../apiUrl"

const ContactDetails = () => {
    let params = useParams()
    let navigate = useNavigate()

    let [contact, setContact] = useState(null)
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState("")
    let [message, setMessage] = useState("")
    let [contactToDelete, setContactToDelete] = useState(null)

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

                    try {
                        await fetch(`${contactUrl}/${params.id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ lastVisitedAt: new Date() }),
                        })
                    } catch (error) {
                        console.log(error.message)
                    }
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

    const handleToggleFavorite = async () => {
        try {
            let token = localStorage.getItem("token")
            let response = await fetch(`${contactUrl}/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isFavorite: !contact.isFavorite }),
            })
            let data = await response.json()

            if (data.success) {
                setContact(data.result)
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage(error.message)
        }
    }

    const handleConfirmDelete = async () => {
        try {
            let token = localStorage.getItem("token")
            let response = await fetch(`${contactUrl}/${params.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            let data = await response.json()

            if (data.success) {
                navigate("/contacts")
            } else {
                setMessage(data.message)
                setContactToDelete(null)
            }
        } catch (error) {
            setMessage(error.message)
            setContactToDelete(null)
        }
    }

    if (loading) {
        return (
            <Layout title="Contact Details">
                <p className="muted-text">Loading contact...</p>
            </Layout>
        )
    }

    if (error !== "") {
        return (
            <Layout title="Contact Details">
                <p className="error-text">{error}</p>
                <NavLink to="/contacts" className="secondary-button">Back to Contacts</NavLink>
            </Layout>
        )
    }

    if (!contact) {
        return (
            <Layout title="Contact Details">
                <p className="empty-text">Contact not found.</p>
                <NavLink to="/contacts" className="secondary-button">Back to Contacts</NavLink>
            </Layout>
        )
    }

    let initials = contact.firstName[0]

    if (contact.lastName) {
        initials = initials + contact.lastName[0]
    }

    return (
        <Layout title="Contact Details">
            <div className="details-card">
                <div className="details-header">
                    {
                        contact.photo
                            ? <img className="avatar large-avatar" src={contact.photo} alt={contact.firstName} />
                            : <div className="avatar large-avatar">{initials}</div>
                    }
                    <div>
                        <h2>{contact.firstName} {contact.lastName}</h2>
                        <p className="muted-text">
                            {contact.isFavorite ? "Favorite contact" : "Not a favorite"}
                        </p>
                    </div>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <span className="label">Email</span>
                        <p>{contact.email !== "" ? contact.email : "Not provided"}</p>
                    </div>

                    <div className="detail-item">
                        <span className="label">Phone</span>
                        <p>{contact.phone}</p>
                    </div>

                    <div className="detail-item">
                        <span className="label">Notes</span>
                        <p>{contact.notes !== "" ? contact.notes : "No notes"}</p>
                    </div>
                </div>

                {message !== "" ? <p className="info-text">{message}</p> : null}

                <div className="details-actions">
                    <NavLink to={`/contacts/edit/${contact._id}`} className="primary-button">
                        Edit Contact
                    </NavLink>

                    <button className="secondary-button" onClick={handleToggleFavorite}>
                        {contact.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </button>

                    <button
                        className="danger-button"
                        onClick={() => setContactToDelete(contact)}
                    >
                        Delete Contact
                    </button>
                </div>
            </div>

            {
                contactToDelete
                    ? <ConfirmDelete
                        contact={contactToDelete}
                        onCancel={() => setContactToDelete(null)}
                        onConfirm={handleConfirmDelete}
                    />
                    : null
            }
        </Layout>
    )
}

export default ContactDetails
