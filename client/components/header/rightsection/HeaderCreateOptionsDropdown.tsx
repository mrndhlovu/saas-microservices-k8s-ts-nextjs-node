import { FiPlus } from "react-icons/fi"

import { UIDropdown } from "../../shared"
import HeaderButton from "../HeaderButton"

const HeaderCreateOptionsDropdown = () => {
  return (
    <UIDropdown
      heading="Create"
      toggle={
        <HeaderButton>
          <FiPlus />
        </HeaderButton>
      }
    >
      <div />
    </UIDropdown>
  )
}

export default HeaderCreateOptionsDropdown
