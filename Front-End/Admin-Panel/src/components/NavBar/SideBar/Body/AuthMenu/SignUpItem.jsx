import NavLink from "../../../NavLink.jsx";

function SignUpItem({ currentPath, to, children }) {
  return (
    <NavLink
      className={`text-white text-decoration-none px-3 
        py-1 rounded-4 ${currentPath == to ? 'fw-bold' : ''}`}
      disabled={currentPath == to ? 'disabled' : ''}
      active={currentPath == to ? 'active' : ''}
      to={to}
      style={{ backgroundColor: "#f94ca4" }}
    >
      {children}
    </NavLink>
  );
}

export default SignUpItem;