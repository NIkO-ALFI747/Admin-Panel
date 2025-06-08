import NavLink from "../../../NavLink.jsx";

function LoginItem({ currentPath, to, children }) {
  return (
    <NavLink
      className={`text-black ${currentPath == to ? 'fw-bold' : ''}`}
      disabled={currentPath == to ? 'disabled' : ''}
      active={currentPath == to ? 'active' : ''}
      to={to}
    >
      {children}
    </NavLink>
  );
}

export default LoginItem;