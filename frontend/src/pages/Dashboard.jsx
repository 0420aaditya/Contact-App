import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import Layout from "../components/Layout"
import ContactList from "../components/ContactList"
import { contactUrl } from "../apiUrl"

const Dashboard = () => {
    let [contacts, setContacts] = useState([])
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState("")

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

    if (loading) {
        return (
            <Layout title="Dashboard">
                <p className="muted-text">Loading dashboard...</p>
            </Layout>
        )
    }

    if (error !== "") {
        return (
            <Layout title="Dashboard">
                <p className="error-text">{error}</p>
            </Layout>
        )
    }

    let totalContacts = contacts.length
    let favoriteContacts = contacts.filter((item) => item.isFavorite)

    let recentlyViewed = contacts
        .filter((item) => item.lastVisitedAt)
        .sort((a, b) => new Date(b.lastVisitedAt) - new Date(a.lastVisitedAt))

    return (
        <Layout title="Dashboard">
            <div className="summary-grid">
                <NavLink to="/contacts" className="summary-card">
                    <h2>Total Contacts</h2>
                    <p className="summary-number">{totalContacts}</p>
                </NavLink>

                <NavLink to="/contacts/favorites" className="summary-card">
                    <h2>Favorite Contacts</h2>
                    <p className="summary-number">{favoriteContacts.length}</p>
                </NavLink>
            </div>

            <div className="section-header">
                <h2>Recently Viewed</h2>
                <p className="muted-text">Sorted by the last time you opened each contact.</p>
            </div>

            <ContactList
                contacts={recentlyViewed}
                showActions={false}
                emptyMessage="No recently viewed contacts yet."
            />

            <div className="quick-actions">
                <NavLink to="/contacts/add" className="primary-button">Add New Contact</NavLink>
                <NavLink to="/contacts" className="secondary-button">View All Contacts</NavLink>
            </div>
        </Layout>
    )
}

export default Dashboard
