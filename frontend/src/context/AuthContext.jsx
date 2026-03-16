import { createContext, useState } from "react"

export const AuthContext = createContext()
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  function login(username) {
    setUser(username)
  }
  function logout() {
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}