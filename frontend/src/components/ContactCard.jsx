import { NavLink } from "react-router-dom"
import { FaStar, FaRegStar, FaEye, FaEdit, FaTrash } from "react-icons/fa"

const ContactCard = ({ contact, onDelete, onToggleFavorite, onToggleSelect, selected = false, showActions = true }) => {
    let initials = contact.firstName[0]

    if (contact.lastName) {
        initials = initials + contact.lastName[0]
    }

    return (
        <div className="contact-card">
            {
                onToggleSelect
                    ? <input
                        type="checkbox"
                        className="contact-checkbox"
                        checked={selected}
                        onChange={() => onToggleSelect(contact._id)}
                    />
                    : null
            }

            {
                contact.photo
                    ? <img className="avatar" src={contact.photo} alt={contact.firstName} />
                    : <div className="avatar">{initials}</div>
            }

            <div className="contact-info">
                <h3>{contact.firstName} {contact.lastName}</h3>
                <p>{contact.email !== "" ? contact.email : "No email"}</p>
                <p>{contact.phone}</p>
            </div>

            <div className="contact-actions">
                {
                    onToggleFavorite
                        ? <button
                            type="button"
                            className="favorite-button"
                            title={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
                            aria-label={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
                            onClick={() => onToggleFavorite(contact)}
                        >
                            {contact.isFavorite ? <FaStar /> : <FaRegStar />}
                        </button>
                        : <span
                            className="favorite-mark"
                            title={contact.isFavorite ? "Favorite" : "Not a favorite"}
                        >
                            {contact.isFavorite ? <FaStar /> : <FaRegStar />}
                        </span>
                }

                <NavLink
                    to={`/contacts/${contact._id}`}
                    className="icon-button"
                    title="View"
                    aria-label="View"
                >
                    <FaEye />
                </NavLink>

                {
                    showActions
                        ? <NavLink
                            to={`/contacts/edit/${contact._id}`}
                            className="icon-button"
                            title="Edit"
                            aria-label="Edit"
                        >
                            <FaEdit />
                        </NavLink>
                        : null
                }

                {
                    showActions
                        ? <button
                            type="button"
                            className="icon-button danger-icon-button"
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => onDelete(contact)}
                        >
                            <FaTrash />
                        </button>
                        : null
                }
            </div>
        </div>
    )
}

export default ContactCard
