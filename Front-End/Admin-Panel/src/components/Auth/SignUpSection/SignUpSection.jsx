import ImageSection from '../ImageSection/ImageSection.jsx'
import LoginForm from '../Form/Login/LoginForm.jsx'
import classes from '../AuthSection.module.css'
import imgClasses from './ImageSection.module.css'
import signUpImg from '../../../assets/signup.png'

function SignUpSection() {
  return (
    <div className={`row border rounded-5 p-3 bg-white shadow ${classes.boxArea}`}>
      <LoginForm />
      <ImageSection className={imgClasses.imageBox} image={signUpImg}/>
    </div>
  );
}

export default SignUpSection;