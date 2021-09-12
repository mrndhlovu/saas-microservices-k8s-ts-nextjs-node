import { CgBoard } from "react-icons/cg"

import { UIDropdown } from "../../shared"

const HeaderBoardsDropdown = () => {
  return (
    <UIDropdown
      className="header-board-dropdown-button"
      heading="Boards"
      toggle={
        <div className="header-board-button">
          <span>
            <CgBoard />
          </span>
          <span className="header-board-text">Boards</span>
        </div>
      }
    >
      <div />
    </UIDropdown>
  )
}

export default HeaderBoardsDropdown
