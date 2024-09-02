export type Product = {
  id: string
  color: string
  name: string
  images: string[]
  meta: string
  description: string
  price: number
  rating: number
  stock: number
}

export type AddProduct = {
  color: string
  name: string
  images: string[]
  description: string
  price: number
  rating: number | null
  stock: number
}

export type PaginationProps = {
  totalPages: number
  currentPage: number
  handleCurrentPageChange: (page: number) => void
}

export type User = {
  id: string
  firstName: string
  lastName: string
  address: string
  email: string
  phoneNumber: number
  birthDate: string
  role: string
}
export type EditUser = {
  id: string
  firstName: string
  lastName: string
  address: string
  email: string
  phoneNumber: number
  birthDate: string
  role: string
}

export type AddUser = {
  firstName: string
  lastName: string
  address: string
  email: string
  phoneNumber: string
  birthDate: string
  role: string
  password: string
  confirmPassword: string
}

export type Order = {
  id: string
  userId: string
  dateTime: number[]
  comments: string
  status: string
  address: string
}

export type AddOrder = {
  userId: string
  dateTime: string
  comments: string
  status: string
  address: string
  products: Product[]
}

export type Payment = {
  id: string
  orderId: string
  amount: number
  status: string
  method: string
}

export type Token = {
  sub: string
  userId: string
}

export const ROLE = {
  Admin: "ADMIN",
  User: "USER",
  Guest: "GUEST"
} as const

export type UserContextType = {
  user: User | null
  token: string | null
  logout: () => void
}

export type DecodedUser = {
  aud: string
  emailAddress: string
  exp: number
  iss: string
  name: string
  nameIdentifier: string
  role: keyof typeof ROLE
}
