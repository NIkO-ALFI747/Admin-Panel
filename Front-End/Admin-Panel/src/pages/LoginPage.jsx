import LoginSection from '../components/Auth/LoginSection/LoginSection.jsx';
import NavBar from '../components/NavBar/NavBar.jsx'

function LoginPage({isAuth, setIsAuth}) {
  return (
    <div className="vh-100 overflow-auto body2">
      <NavBar isAuth={isAuth} setIsAuth={setIsAuth}/>
      <div 
        className="container d-flex justify-content-center align-items-start mb-3 body3"
        style={{marginTop:"9vh"}}
      >
        <LoginSection setIsAuth={setIsAuth}/>
      </div>
    </div>
  );
}

export default LoginPage;