export const routeNames = {
  Public: {
    login: "/login",
    productParent: "/products",
    productDetails: "/products/:id",
    checkout:"/checkout"
  },

  Admin: {
    dashboard: "/dashboard"
  },

  User: {
    parent: "/users",
    details: "/users/:id"
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
