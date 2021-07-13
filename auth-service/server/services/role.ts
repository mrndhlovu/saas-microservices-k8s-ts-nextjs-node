import { ROLES } from "../utils/constants"

class RolesService {
  validateBoardAccess(permFlag: number) {
    return permFlag & ROLES.ADMIN
  }

  validateAction(permFlag: number) {
    switch (permFlag) {
      case ROLES.ADMIN:
        break

      default:
        break
    }
    return permFlag & ROLES.ADMIN
  }

  validateRole(permFlag: number) {
    switch (permFlag) {
      case ROLES.ADMIN:
        return (permFlag & ROLES.ADMIN) === ROLES.ADMIN

      default:
        break
    }
    return permFlag & ROLES.ADMIN
  }
}

export default new RolesService()
