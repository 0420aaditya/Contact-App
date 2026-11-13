import { NavLink, useNavigate } from "react-router-dom"

const Sidebar = () => {
    let navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("name")
        navigate("/login")
    }

    return (
        <aside className="sidebar">
            <NavLink to="/dashboard" className="sidebar-logo">Contact Manager</NavLink>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/contacts" end className="nav-link">Contacts</NavLink>
                <NavLink to="/contacts/favorites" className="nav-link">Favorites</NavLink>
                <NavLink to="/contacts/add" className="nav-link">Add Contact</NavLink>
                <NavLink to="/profile" className="nav-link">Profile</NavLink>
            </nav>

            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </aside>
    )
}

export default Sidebar
