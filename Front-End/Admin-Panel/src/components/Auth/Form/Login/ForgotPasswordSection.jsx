import { NavLink } from "react-router"

function ForgotPasswordSection() {
  return (
    <div className="forgot">
      <small>
        <NavLink to='/contact'>Forgot Password?</NavLink>
      </small>
    </div>
  );
}

export default ForgotPasswordSection;