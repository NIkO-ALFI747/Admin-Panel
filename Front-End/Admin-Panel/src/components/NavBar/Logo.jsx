import NavLink from './NavLink.jsx'

function Logo({ currentPath, to, children }) {
  return (
    <NavLink
      className="navbar-brand fs-4"
      disabled={currentPath == to ? 'disabled' : ''}
      to={to}
    >
      {children}
    </NavLink>
  );
}

export default Logo;