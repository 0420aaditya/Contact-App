import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import ContactList from "../components/ContactList"
import ConfirmDelete from "../components/ConfirmDelete"
import { contactUrl } from "../apiUrl"

const Favorites = () => {
    let [contacts, setContacts] = useState([])
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState("")
    let [message, setMessage] = useState("")
    let [contactToDelete, setContactToDelete] = useState(null)

    useEffect(() => {
        const loadContacts = async () => {
            try {
                let token = localStorage.getItem("token")
                let response = await fetch(contactUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                let data = await response.json()

                if (data.success) {
                    setContacts(data.result)
                } else {
                    setError(data.message)
                }
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadContacts()
    }, [])

    let favoriteContacts = contacts.filter((item) => item.isFavorite)

    const handleToggleFavorite = async (contact) => {
        try {
            let token = localStorage.getItem("token")
            let response = await fetch(`${contactUrl}/${contact._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isFavorite: !contact.isFavorite }),
            })
            let data = await response.json()

            if (data.success) {
                setContacts(contacts.map((item) => item._id === data.result._id ? data.result : item))
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
            let response = await fetch(`${contactUrl}/${contactToDelete._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            let data = await response.json()

            if (data.success) {
                setContacts(contacts.filter((item) => item._id !== contactToDelete._id))
                setMessage("Contact deleted successfully.")
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage(error.message)
        }

        setContactToDelete(null)
    }

    if (loading) {
        return (
            <Layout title="Favorite Contacts">
                <p className="muted-text">Loading contacts...</p>
            </Layout>
        )
    }

    if (error !== "") {
        return (
            <Layout title="Favorite Contacts">
                <p className="error-text">{error}</p>
            </Layout>
        )
    }

    return (
        <Layout title="Favorite Contacts">
            {message !== "" ? <p className="info-text">{message}</p> : null}

            <ContactList
                contacts={favoriteContacts}
                onDelete={(contact) => setContactToDelete(contact)}
                onToggleFavorite={handleToggleFavorite}
                emptyMessage="No favorite contacts yet."
            />

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

export default Favorites
