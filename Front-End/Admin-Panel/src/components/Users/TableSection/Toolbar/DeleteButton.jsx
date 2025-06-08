
function DeleteButton({ deleteUser, selectedCount }) {
  return (
    <div>
      <button
        type="button"
        className={`btn btn-light text-danger border border-danger-subtle`}
        title="Delete"
        onClick={deleteUser}
        disabled={selectedCount === 0}
      >
        <i className="bi bi-trash-fill"></i>
      </button>
    </div>
  );
}

export default DeleteButton;