export const routeNames = {
  Public: {
    login: "/login",
    register: "/register",
    pageNotFound: "/page-not-found",
    logout: "/logout",
    productParent: "/products",
    productDetails: "/products/:id"
  },

  User: {
    parent: "/users",
    details: "/users/:id",
    profile: "/user/profile"
  },

  Admin: {
    dashboard: "/dashboard",
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
