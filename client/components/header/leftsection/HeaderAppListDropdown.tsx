import { BsFillGrid3X3GapFill } from "react-icons/bs"

import { UIDropdown } from "../../shared"
import HeaderButton from "../HeaderButton"

const HeaderAppListDropdown = () => {
  return (
    <UIDropdown
      heading="Applications"
      toggle={
        <HeaderButton>
          <BsFillGrid3X3GapFill />
        </HeaderButton>
      }
    >
      <div />
    </UIDropdown>
  )
}

export default HeaderAppListDropdown
