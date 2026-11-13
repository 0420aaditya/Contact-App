import { NavLink } from "react-router-dom"

const Header = ({ title }) => {
    let storedName = localStorage.getItem("name")
    let displayName = storedName ? storedName : "Admin"
    let initial = displayName[0].toUpperCase()

    return (
        <header className="header">
            <h1>{title}</h1>

            <div className="header-actions">
                <NavLink to="/contacts/add" className="primary-button">Add Contact</NavLink>

                <NavLink to="/profile" className="profile" title="View profile">
                    <div className="profile-avatar">{initial}</div>
                    <span>{displayName}</span>
                </NavLink>
            </div>
        </header>
    )
}

export default Header
