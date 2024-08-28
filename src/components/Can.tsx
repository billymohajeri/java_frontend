import { useContext } from "react"
import {
  ResourcePermission,
  PagePermission,
  PermissionCategory,
  RBAC_ROLES,
  Role
} from "../lib/access-control"
import { UserContext } from "@/providers/user-provider"

const checkPermission = (
  role: Role,
  permission: ResourcePermission | PagePermission,
  permissionType: PermissionCategory
): boolean => {
  const permissions = RBAC_ROLES[role]
  if (!permissions) {
    return false
  }

  switch (permissionType) {
    case "views": {
      const viewPermissions = permissions.views
      if (!viewPermissions || viewPermissions.length === 0) {
        return false
      }

      const canViewPage = viewPermissions.includes(permission as PagePermission)
      if (!canViewPage) {
        return false
      }

      return true
    }

    case "actions": {
      const actionPermissions = permissions.actions
      if (!actionPermissions || actionPermissions.length === 0) {
        return false
      }

      const canPerformAction = actionPermissions.includes(permission as ResourcePermission)
      if (!canPerformAction) {
        return false
      }

      return true
    }

    default:
      return false
  }
}

type CanProp = {
  permission: ResourcePermission | PagePermission
  yes: any
  no?: any
  permissionType: PermissionCategory
}

export const Can = ({ permission, permissionType, yes, no = () => null }: CanProp) => {
  const context = useContext(UserContext)

  let USER_ROLE: Role = "GUEST"
  if (context && context.user?.role) {
    if (context.user.role === "ADMIN") {
      USER_ROLE = "ADMIN"
    } else {
      USER_ROLE = "USER"
    }
  }

  return checkPermission(USER_ROLE, permission, permissionType) ? yes() : no()
}
