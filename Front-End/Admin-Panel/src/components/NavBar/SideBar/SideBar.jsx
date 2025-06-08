import Header from './Header/Header.jsx'
import Body from './Body/Body.jsx'

function SideBar({header, currentPath, isAuth, setIsAuth}) {
  return (
    <div
      className="sidebar offcanvas offcanvas-end"
      tabindex="-1"
      id="offcanvasNavbar"
      aria-labelledby="offcanvasNavbarLabel"
    >
      <Header>{header}</Header>
      <Body currentPath={currentPath} isAuth={isAuth} setIsAuth={setIsAuth}/>
    </div>
  );
}

export default SideBar;