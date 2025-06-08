import NavLink from "../../../NavLink.jsx";

function Item({ currentPath, to, children }) {
  return (
    <li className="nav-item mx-2">
      <NavLink
        className={currentPath == to ? 'fw-bold' : ''}
        disabled={currentPath == to ? 'disabled' : ''}
        active={currentPath == to ? 'active' : ''}
        to={to}
      >
        {children}
      </NavLink>
    </li>
  );
}

export default Item;