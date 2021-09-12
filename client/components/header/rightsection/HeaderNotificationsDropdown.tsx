import { FiBell } from "react-icons/fi"

import { UIDropdown } from "../../shared"
import HeaderButton from "../HeaderButton"

const HeaderNotificationsDropdown = () => {
  return (
    <UIDropdown
      heading="Notifications"
      className="header-button"
      toggle={
        <HeaderButton>
          <FiBell />
        </HeaderButton>
      }
    >
      <div />
    </UIDropdown>
  )
}

export default HeaderNotificationsDropdown
