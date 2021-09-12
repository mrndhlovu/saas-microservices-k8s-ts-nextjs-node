import { AiOutlineExclamationCircle } from "react-icons/ai"

import { UIDropdown } from "../../shared"
import HeaderButton from "../HeaderButton"

const HeaderInformationDropdown = () => {
  return (
    <UIDropdown
      heading="Information"
      toggle={
        <HeaderButton>
          <AiOutlineExclamationCircle />
        </HeaderButton>
      }
    >
      <div />
    </UIDropdown>
  )
}

export default HeaderInformationDropdown
