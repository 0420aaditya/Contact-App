const ConfirmDelete = ({ contact, onCancel, onConfirm }) => {
    return (
        <div className="dialog-backdrop">
            <div className="dialog">
                <h2>Delete contact?</h2>
                <p>
                    Are you sure you want to delete {contact.firstName} {contact.lastName}?
                    This action cannot be undone.
                </p>

                <div className="dialog-actions">
                    <button className="secondary-button" onClick={onCancel}>Cancel</button>
                    <button className="danger-button" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDelete
