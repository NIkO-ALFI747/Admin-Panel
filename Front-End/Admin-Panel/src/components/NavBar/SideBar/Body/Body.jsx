import AuthMenu from "./AuthMenu/AuthMenu.jsx";
import NavMenu from "./NavMenu/NavMenu.jsx";

function Body({currentPath, isAuth, setIsAuth}) {
  return (
    <div className="offcanvas-body d-flex flex-column flex-md-row p-4 p-md-0">
      <NavMenu currentPath={currentPath} isAuth={isAuth}/>
      <AuthMenu currentPath={currentPath} isAuth={isAuth} setIsAuth={setIsAuth}/>
    </div>
  );
}

export default Body;