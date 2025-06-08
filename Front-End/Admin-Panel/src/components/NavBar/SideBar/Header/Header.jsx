import CloseButton from "./CloseButton.jsx";

function Header({children}) {
  return (
    <div className="offcanvas-header text-black border-bottom">
      <h5 className="offcanvas-title" id="offcanvasNavbarLabel">{children}</h5>
      <CloseButton />
    </div>
  );
}

export default Header;