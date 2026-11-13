const ConfirmBulkDelete = ({ count, onCancel, onConfirm }) => {
    return (
        <div className="dialog-backdrop">
            <div className="dialog">
                <h2>Delete contacts?</h2>
                <p>
                    Are you sure you want to delete {count} contacts?
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

export default ConfirmBulkDelete
