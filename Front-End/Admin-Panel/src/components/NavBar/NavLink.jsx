import { NavLink as RouterNavLink } from "react-router"

function NavLink({ disabled, active, className, children, ...props }) {
  return (
    <RouterNavLink
      className={`nav-link ${className} ${active || ''} ${disabled || ''}`}
      aria-disabled={disabled ? "true" : "false"}
      aria-current={active ? "page" : "false"}
      {...props}
    >
      {children}
    </RouterNavLink>
  );
}

export default NavLink;