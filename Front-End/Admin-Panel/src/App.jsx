import { useEffect } from 'react'
import './App.css'
import { fetchUsers } from './services/user.js'
import AppRouter from './components/Router/AppRouter.jsx'

// LoginForm

function App() {
  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
    }
    fetchData();
  }, [])

  return (
    <AppRouter/>
  )
}

export default App