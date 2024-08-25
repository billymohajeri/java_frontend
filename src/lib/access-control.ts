export type Role = "ADMIN" | "USER"

export type RoleControl = {
  [key: string]: {
    views: PagePermission[]
    actions: ResourcePermission[]
  }
}

export type PermissionCategory = keyof RoleControl[Role]

type Page = "HOME" | "DASHBOARD"
type Resource = "PRODUCT" | "USER" | "ORDER"
type Method = "GET" | "ADD" | "EDIT" | "REMOVE"

export type ResourcePermission = `${Resource}:${Method}`
export type PagePermission = `${Page}:VIEW`

export const RBAC_ROLES: RoleControl = {
  ADMIN: {
    views: ["HOME:VIEW", "DASHBOARD:VIEW"],
    actions: [
      "PRODUCT:GET",
      "PRODUCT:REMOVE",
      "PRODUCT:ADD",
      "PRODUCT:EDIT",
      "USER:GET",
      "USER:ADD",
      "USER:REMOVE",
      "USER:EDIT",
      "ORDER:GET"
    ]
  },
  USER: {
    views: ["HOME:VIEW"],
    actions: ["PRODUCT:GET"]
  }
}
