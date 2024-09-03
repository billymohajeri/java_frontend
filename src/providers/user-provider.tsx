import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Token, UserContextType } from "../types"
import jwtDecode from "jwt-decode"
import { useUserDetails } from "@/hooks/useUserDetails"
import { saveDataToLocalStorage } from "@/lib/utils"

export const UserContext = createContext<UserContextType | null>(null)

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState("")
  const tokenFromStorage = localStorage.getItem("token")?.replace(/"/g, "") || null
  const [token, setToken] = useState<string | null>(tokenFromStorage)

  const handleDecodeUser = (token: string): Token | null => {
    try {
      return jwtDecode<Token>(token)
    } catch (error) {
      console.error("Token decoding failed", error)
      return null
    }
  }

  useEffect(() => {
    if (token) {
      const decodedToken = handleDecodeUser(token)
      if (decodedToken) {
        setUserId(decodedToken.userId)
      }
    }
  }, [token])

  const login = (newToken: string) => {
    const decodedToken = handleDecodeUser(newToken)
    if (decodedToken) {
      setUserId(decodedToken.userId)
      setToken(newToken)
      saveDataToLocalStorage("token", newToken)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUserId("")
  }

  const { data: user } = useUserDetails(userId || "", token || "");

  return (
    <UserContext.Provider value={{ user, token, logout, login }}>{children}</UserContext.Provider>
  )
}
