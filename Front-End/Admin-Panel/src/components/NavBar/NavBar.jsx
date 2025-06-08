import { useLocation } from "react-router"
import Logo from './Logo.jsx'
import ToggleButton from './ToggleButton.jsx'
import SideBar from "./SideBar/SideBar.jsx";

function NavBar({isAuth, setIsAuth}) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="navbar navbar-expand-md">
      <div className="container">
        <Logo currentPath={currentPath} to='/'>TUM</Logo>
        <ToggleButton />
        <SideBar header="TUM" currentPath={currentPath} isAuth={isAuth} setIsAuth={setIsAuth}/>
      </div>
    </nav>
  );
}

export default NavBar;