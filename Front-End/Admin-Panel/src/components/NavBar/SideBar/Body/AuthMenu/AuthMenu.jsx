import LoginItem from "./LoginItem.jsx";
import SignUpItem from "./SignUpItem.jsx";
import SignOutItem from "./SignOutItem.jsx";

function AuthMenu({ currentPath, isAuth, setIsAuth }) {
  return (
    <div
      className="d-flex flex-column flex-md-row 
      justify-content-center align-items-center gap-3"
    >
      {isAuth
        ? <SignOutItem to='/' setIsAuth={setIsAuth}>Sign Out</SignOutItem>
        :
        <>
          <LoginItem currentPath={currentPath} to='/login'>Login</LoginItem>
          <SignUpItem currentPath={currentPath} to='/register'>Sign Up</SignUpItem>
        </>
      }
    </div>
  );
}

export default AuthMenu;