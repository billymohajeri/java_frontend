import {
  Role,
  ResourcePermission,
  PagePermission,
  PermissionCategory,
  RBAC_ROLES
} from "../lib/access-control"

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
  // change this to be dynamic based on what the token has
  const USER_ROLE = "ADMIN"
  // const USER_ROLE = "USER"

  return checkPermission(USER_ROLE, permission, permissionType) ? yes() : no()
}
