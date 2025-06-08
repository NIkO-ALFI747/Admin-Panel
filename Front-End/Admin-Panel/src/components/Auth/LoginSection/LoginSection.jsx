import ImageSection from '../ImageSection/ImageSection.jsx'
import LoginForm from '../Form/Login/LoginForm.jsx'
import classes from '../AuthSection.module.css'
import imgClasses from './ImageSection.module.css'
import loginImg from '../../../assets/login.png'

function LoginSection({setIsAuth}) {
  return (
    <div className={`row border rounded-5 p-3 bg-white shadow ${classes.boxArea}`}>
      <ImageSection className={imgClasses.imageBox} image={loginImg}/>
      <LoginForm setIsAuth={setIsAuth}/>
    </div>
  );
}

export default LoginSection;