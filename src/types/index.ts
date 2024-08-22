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

export type PaginationProps = {
  totalPages: number
  currentPage: number
  handleCurrentPageChange: (page: number) => void
}


export type User = {
  id: string;
  fullName: string;
  phone: number;
  email: string;
  role: string;
};

export const ROLE = {
  Admin: "ADMIN",
  User: "USER"
} as const;

export type DecodedUser = {
  aud: string;
  emailAddress: string;
  exp: number;
  iss: string;
  name: string;
  nameIdentifier: string;
  role: keyof typeof ROLE;
};