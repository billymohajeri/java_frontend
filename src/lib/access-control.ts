export type Role = "ADMIN" | "USER"

export type RoleControl = {
  [key: string]: {
    views: PagePermission[]
    actions: ResourcePermission[]
  }
}

export type PermissionCategory = keyof RoleControl[Role]

type Page = "HOME" | "DASHBOARD" | "USER" 
type Resource = "PRODUCT" | "USER"
type Method = "GET" | "ADD" | "EDIT" | "REMOVE"

export type ResourcePermission = `${Resource}:${Method}`
export type PagePermission = `${Page}:VIEW`

export const RBAC_ROLES: RoleControl = {
  ADMIN: {
    views: ["HOME:VIEW", "DASHBOARD:VIEW", "USER:VIEW"],
    actions: [
      "PRODUCT:GET",
      "PRODUCT:REMOVE",
      "PRODUCT:ADD",
      "PRODUCT:EDIT",
      "USER:ADD",
      "USER:REMOVE",
      "USER:EDIT"
    ]
  },
  USER: {
    views: ["HOME:VIEW"],
    actions: ["PRODUCT:GET"]
  }
}
