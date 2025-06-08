import NavBar from '../components/NavBar/NavBar.jsx'
import TableSection from '../components/Users/TableSection/TableSection.jsx';
import classes from '../components/Users/TableSection/TableSection.module.css'

function UsersPage({isAuth, setIsAuth}) {
  return (
    <div className={`vh-100 body overflow-auto`}>
      <NavBar isAuth={isAuth} setIsAuth={setIsAuth}/>
      <div
        className="container d-flex justify-content-center align-items-start"
      >
        <div className={`row border rounded-5 p-3 mt-5 mb-3 bg-white shadow ${classes.tableArea}`}>
          <TableSection />
        </div>
      </div>
    </div>
  );
}

export default UsersPage;