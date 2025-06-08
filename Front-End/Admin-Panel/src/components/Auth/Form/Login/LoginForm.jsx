import EmailInput from '../Inputs/EmailInput.jsx'
import PasswordInput from '../Inputs/PasswordInput.jsx'
import SubmitButton from '../SubmitButton.jsx'
import ForgotPasswordSection from './ForgotPasswordSection.jsx';
import RememberMeSection from './RememberMeSection.jsx';
import SignUpSection from './SignUpSection.jsx'
import Title from './Title.jsx'
import classes from '../Form.module.css'

function LoginForm({setIsAuth}) {
  return (
    <div className={`col-md-6 ${classes.formBox}`}>
      <div className="row align-items-center">
        <Title />
        <EmailInput />
        <PasswordInput />
        <div className="input-group mb-5 d-flex justify-content-between">
          <RememberMeSection />
          <ForgotPasswordSection />
        </div>
        <SubmitButton onClick={(e)=>setIsAuth(true)}>Login</SubmitButton>
        <SignUpSection />
      </div>
    </div>
  );
}

export default LoginForm;