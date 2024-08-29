import { createContext, ReactNode, useEffect, useState } from "react"
import { Token, UserContextType } from "../types"
import jwtDecode from "jwt-decode"
import { useUserDetails } from "@/hooks/useUserDetails"

export const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState("")
  const tokenWithQuotes = localStorage.getItem("token")
  const myToken = tokenWithQuotes?.replace(/"/g, "") || null
  const [token, setToken] = useState<string | null>(myToken)

  const handleDecodeUser = (token: string): Token | null => {
    try {
      const decodedToken = jwtDecode<Token>(token)
      return decodedToken
    } catch (error) {
      console.error("Token decoding failed", error)
      return null
    }
  }

  useEffect(() => {
    if (token) {
      const decodedToken = handleDecodeUser(token) as Token
      if (decodedToken) {
        setUserId(decodedToken.userId)
      }
    }
  }, [token])

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUserId("")
  }

 
  const { data: user } = useUserDetails(userId as string, token as string)

  return (
    <UserContext.Provider value={{ user, token, logout }}>{children}</UserContext.Provider>
  )
}
