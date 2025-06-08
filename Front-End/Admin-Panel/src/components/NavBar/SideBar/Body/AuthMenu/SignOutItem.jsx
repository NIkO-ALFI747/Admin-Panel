
function SignOutItem({ children, setIsAuth }) {
  return (
    <button
      type="button"
      className={`btn btn-link text-white text-decoration-none px-3 py-1 rounded-4`}
      style={{ backgroundColor: "#38bdff" }}
      onClick={(e)=>setIsAuth(false)}
    >
      {children}
    </button>
  );
}

export default SignOutItem;