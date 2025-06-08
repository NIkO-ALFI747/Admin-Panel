
function SubmitButton({ children, ...props }) {
  return (
    <div className="input-group mb-3">
      <button {...props} className="btn btn-lg btn-primary w-100 fs-6">{children}</button>
    </div>
  );
}

export default SubmitButton;