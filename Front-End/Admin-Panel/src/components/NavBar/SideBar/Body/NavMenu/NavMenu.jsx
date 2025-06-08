import Item from "./Item.jsx";

function NavMenu({ currentPath, isAuth }) {
  return (
    <ul
      className="navbar-nav justify-content-center 
      align-items-center fs-5 flex-grow-1 pe-3"
    >
      <Item currentPath={currentPath} to='/'>Home</Item>
      <Item currentPath={currentPath} to='/contact'>Contact</Item>
      {isAuth && <Item currentPath={currentPath} to='/users'>Users</Item>}
    </ul>
  );
}

export default NavMenu;