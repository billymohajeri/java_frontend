export const routeNames = {
  Public: {
    login: "/login",
    register: "/register",
    home: "/home",
    pageNotFound: "/page-not-found",
    contact: "/contact",
    productDetails: "/products/",
    logout: "/logout"
  },
  User: {
    parentRoute: "/users", 
    details: "/users/:id", 
    profile: "/user/profile"
  },
  Admin: {
    parentRoute: "/admin",
    profile: "/admin/profile",
    products: "/admin/products"
  }
}
