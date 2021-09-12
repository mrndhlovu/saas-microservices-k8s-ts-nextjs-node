import { useRouter } from "next/router"
import { MenuItem } from "@chakra-ui/react"

import { UIDropdown } from "../../shared"
import { useAuth } from "../../../lib/hooks/context"
import { ROUTES } from "../../../util/constants"
import UserAvatar from "../../shared/lib/UserAvatar"

const HeaderAuthDropdown = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const username = user?.username

  const HEADER_AUTH_MENU_OPTIONS = [
    {
      handleClick: () => router.push(`/${username}/profile`),
      key: "profile",
      title: "Profile",
    },

    {
      handleClick: () => router.push(`/${username}/${ROUTES.billing}`),
      key: "billing",
      title: "Billing",
    },
    {
      handleClick: () => router.push(`/${username}/${ROUTES.settings}`),
      key: "settings",
      title: "Settings",
    },
    { handleClick: logout, key: "logout", title: "Log out" },
  ]

  return (
    <UIDropdown
      className="header-auth-dropdown"
      heading="Account"
      toggle={<UserAvatar />}
    >
      {HEADER_AUTH_MENU_OPTIONS.map((option, index) => (
        <MenuItem
          key={option?.key || index}
          onClick={option?.handleClick}
          className="header-dropdown-item-text"
        >
          {option?.title}
        </MenuItem>
      ))}
    </UIDropdown>
  )
}

export default HeaderAuthDropdown
