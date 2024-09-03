export const routeNames = {
  Public: {
    login: "/login",
    register: "/register",
    pageNotFound: "/page-not-found",
    logout: "/logout",
    productParent: "/products",
    productDetails: "/products/:id",
    profile: "/profile"
  },

  User: {
    parent: "/users",
    details: "/users/:id",
  },

  Admin: {
    dashboard: "/dashboard"
  },

  Order: {
    parent: "/orders",
    details: "/orders/:id"
  },

  Payment: {
    parent: "/payments",
    details: "/payments/:id"
  }
}
