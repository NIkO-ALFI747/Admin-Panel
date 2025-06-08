import NavBar from '../components/NavBar/NavBar.jsx'

function ContactPage({isAuth, setIsAuth}) {
  return (
    <div className="vh-100 overflow-hidden body">

      <NavBar isAuth={isAuth} setIsAuth={setIsAuth}/>
      <main>
        <section
          className="w-100 vh-100 d-flex flex-column justify-content-center 
          align-items-center text-black fs-1"
        >
          <div className="row w-100 justify-content-center">
            <div className="col-6 text-wrap text-center">
              <h1 style={{ fontSize: "1.5em" }}>Contact Us</h1>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ContactPage;