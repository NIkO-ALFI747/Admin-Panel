import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router"
import HomePage from '../../pages/HomePage.jsx'
import RegistrationPage from '../../pages/RegistrationPage.jsx'
import LoginPage from '../../pages/LoginPage.jsx'
import ContactPage from '../../pages/ContactPage.jsx'
import ErrorPage from '../../pages/ErrorPage.jsx'
import UsersPage from "../../pages/UsersPage.jsx"

function AppRouter() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <Routes>
      {isAuth
        ?
        <>
          <Route path="/users" element={<UsersPage isAuth={isAuth} setIsAuth={setIsAuth} />} />
          <Route path="/register" element={<Navigate to="/users" />} />
          <Route path="/login" element={<Navigate to="/users" />} />
        </>
        :
        <>
          <Route path="/register" element={<RegistrationPage isAuth={isAuth} setIsAuth={setIsAuth} />} />
          <Route path="/login" element={<LoginPage isAuth={isAuth} setIsAuth={setIsAuth} />} />
          <Route path="/users" element={<Navigate to="/login" />} />
        </>
      }
      <Route path="/" element={<HomePage isAuth={isAuth} setIsAuth={setIsAuth} />} />
      <Route path="/contact" element={<ContactPage isAuth={isAuth} setIsAuth={setIsAuth} />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/error" />} />
    </Routes>
  );
}

export default AppRouter;