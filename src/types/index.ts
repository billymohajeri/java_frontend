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