import classes from '../Toolbar.module.css'


function ButtonToolbar({ blockUser, selectedCount }) {
  return (
    <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
      <div className="btn-group me-2" role="group">
        <button
          type="button"
          className={`btn btn-light text-warning ${classes.btnBorder}`}
          onClick={(e) => blockUser(true)}
          disabled={selectedCount === 0}
        >
          <i className="bi bi-lock-fill me-1"></i> Block
        </button>
        <button
          type="button"
          className="btn btn-light text-primary border border-primary-subtle"
          title="Unblock"
          onClick={(e) => blockUser(false)}
          disabled={selectedCount === 0}
        >
          <i className="bi bi-unlock-fill"></i>
        </button>
      </div>
    </div>
  );
}

export default ButtonToolbar;