import { useNavigate } from "react-router-dom"

import api from "@/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { saveDataToLocalStorage } from "@/lib/utils"
import { ChangeEvent, FormEvent, useContext, useState } from "react"
import { UserContext } from "@/providers/user-provider"

const Login = () => {
  const context = useContext(UserContext)
  if (!context) {
    return null
  }
  const { login } = context
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post(`/users/login`, credentials)
      if (response.status === 200) {
        toast({
          title: "✅ Login successful!",
          className:"bg-green-100 text-black dark:bg-emerald-900 dark:text-white",
          description: `Welcome ${response.data.data.user.firstName}`
        })

        const token = response.data.data.token
        login(token)
        navigate("/")
      } else {
        toast({
          title: "❌ Login failed!",
          description: `${response.status}`
        })
        throw new Error("Login failed with status: " + response.status)
      }
    } catch (error) {
      toast({
        title: "❌ Login failed!",
        description: `${error}`
      })
      console.error("Login request failed with error:", error)
      throw error
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleLogin}>
        <Tabs defaultValue="login" className="w-[400px] ">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password*</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    required
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button type="submit">Login</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Fields marked with * are required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input id="firstName" type="text" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input id="lastName" type="text" placeholder="Enter your last name" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" type="text" placeholder="Enter your address" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email*</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="tel" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input id="birthDate" type="date" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="role">Role*</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"></div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password*</Label>
                    <Input id="password" type="password" placeholder="Enter your password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="repeatPassword">Retype Password*</Label>
                    <Input id="repeatPassword" type="password" placeholder="Retype your password" />
                  </div>
                </CardContent>
              </CardContent>
              <CardFooter className="justify-center">
                <Button>Register</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

export default Login
