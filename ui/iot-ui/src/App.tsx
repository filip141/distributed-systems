import { useState } from "react"
import Login from "./auth/Login"
import Dashboard from "./Dashboard"

function hasToken() {
  return !!localStorage.getItem("access")
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(hasToken())

  const handleLogin = () => setIsLoggedIn(true)

  const handleLogout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return <Dashboard onLogout={handleLogout} />
}