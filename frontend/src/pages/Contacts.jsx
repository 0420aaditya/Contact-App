import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import Layout from "../components/Layout"
import ContactList from "../components/ContactList"
import ConfirmDelete from "../components/ConfirmDelete"
import ConfirmBulkDelete from "../components/ConfirmBulkDelete"
import { contactUrl } from "../apiUrl"
import * as XLSX from "xlsx"

const Contacts = () => {
    let [contacts, setContacts] = useState([])
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState("")
    let [message, setMessage] = useState("")
    let [search, setSearch] = useState("")
    let [selectedIds, setSelectedIds] = useState([])
    let [contactToDelete, setContactToDelete] = useState(null)
    let [showBulkConfirm, setShowBulkConfirm] = useState(false)

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
                setSelectedIds(selectedIds.filter((item) => item !== contactToDelete._id))
                setMessage("Contact deleted successfully.")
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage(error.message)
        }

        setContactToDelete(null)
    }

    const handleToggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleConfirmBulkDelete = async () => {
        try {
            let token = localStorage.getItem("token")
            let response = await fetch(`${contactUrl}/delete-many`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ids: selectedIds }),
            })
            let data = await response.json()

            if (data.success) {
                setContacts(contacts.filter((item) => !selectedIds.includes(item._id)))
                setSelectedIds([])
                setMessage(data.result + " contacts deleted.")
            } else {
                setMessage(data.message)
            }
        } catch (error) {
            setMessage(error.message)
        }

        setShowBulkConfirm(false)
    }

    const handleExport = () => {
        let rows = contacts.map((item) => ({
            "First Name": item.firstName,
            "Last Name": item.lastName,
            "Email": item.email,
            "Phone": item.phone,
            "Notes": item.notes,
            "Favorite": item.isFavorite ? "Yes" : "No",
        }))

        let worksheet = XLSX.utils.json_to_sheet(rows)
        let workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts")
        XLSX.writeFile(workbook, "contacts.xlsx")
    }

    if (loading) {
        return (
            <Layout title="All Contacts">
                <p className="muted-text">Loading contacts...</p>
            </Layout>
        )
    }

    if (error !== "") {
        return (
            <Layout title="All Contacts">
                <p className="error-text">{error}</p>
            </Layout>
        )
    }

    let searchText = search.toLowerCase()

    let filteredContacts = contacts.filter((item) => {
        let firstName = item.firstName ? item.firstName.toLowerCase() : ""
        let lastName = item.lastName ? item.lastName.toLowerCase() : ""
        let email = item.email ? item.email.toLowerCase() : ""
        let phone = item.phone ? item.phone.toLowerCase() : ""

        return firstName.includes(searchText) || lastName.includes(searchText) || email.includes(searchText) || phone.includes(searchText)
    })

    let allSelected = filteredContacts.length > 0 && filteredContacts.every((item) => selectedIds.includes(item._id))

    const handleToggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredContacts.map((item) => item._id))
        }
    }

    return (
        <Layout title="All Contacts">
            <div className="toolbar">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search by name, email or phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="secondary-button" onClick={handleExport}>Export to Excel</button>
                <NavLink to="/contacts/add" className="primary-button">Add Contact</NavLink>
            </div>

            <div className="bulk-bar">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleToggleSelectAll}
                    />
                    Select all
                </label>

                {
                    selectedIds.length > 0
                        ? <button className="danger-button" onClick={() => setShowBulkConfirm(true)}>
                            Delete Selected ({selectedIds.length})
                        </button>
                        : null
                }
            </div>

            {message !== "" ? <p className="info-text">{message}</p> : null}

            <ContactList
                contacts={filteredContacts}
                onDelete={(contact) => setContactToDelete(contact)}
                onToggleFavorite={handleToggleFavorite}
                onToggleSelect={handleToggleSelect}
                selectedIds={selectedIds}
                emptyMessage="No contacts found."
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

            {
                showBulkConfirm
                    ? <ConfirmBulkDelete
                        count={selectedIds.length}
                        onCancel={() => setShowBulkConfirm(false)}
                        onConfirm={handleConfirmBulkDelete}
                    />
                    : null
            }
        </Layout>
    )
}

export default Contacts
