import SignUpSection from '../components/Auth/SignUpSection/SignUpSection.jsx';
import NavBar from '../components/NavBar/NavBar.jsx'

function RegistrationPage({isAuth, setIsAuth}) {
  return (
    <div className="vh-100 overflow-auto body2">
      <NavBar isAuth={isAuth} setIsAuth={setIsAuth}/>
      <div 
        className="container d-flex justify-content-center align-items-start mb-3 body3"
        style={{marginTop:"9vh"}}
      >
        <SignUpSection />
      </div>
    </div>
  );
}

export default RegistrationPage;