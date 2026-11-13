import ContactCard from "./ContactCard"

const ContactList = ({ contacts, onDelete, onToggleFavorite, onToggleSelect, selectedIds = [], showActions = true, emptyMessage }) => {
    if (contacts.length === 0) {
        return <p className="empty-text">{emptyMessage}</p>
    }

    return (
        <div className="contact-list">
            {
                contacts.map((item) => (
                    <ContactCard
                        key={item._id}
                        contact={item}
                        onDelete={onDelete}
                        onToggleFavorite={onToggleFavorite}
                        onToggleSelect={onToggleSelect}
                        selected={selectedIds.includes(item._id)}
                        showActions={showActions}
                    />
                ))
            }
        </div>
    )
}

export default ContactList
