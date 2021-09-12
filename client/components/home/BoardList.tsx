import { AiOutlineStar, AiOutlineClockCircle } from "react-icons/ai"
import { useHomeContext } from "../../lib/providers"

import BoardsGroup from "./BoardsGroup"

const BoardList = () => {
  const { boards } = useHomeContext()

  return (
    <>
      <BoardsGroup
        heading="Starred boards"
        icon={<AiOutlineStar size={22} />}
        boards={boards}
        category="starred"
      />
      <BoardsGroup
        heading="Recently viewed"
        icon={<AiOutlineClockCircle size={22} />}
        boards={boards}
        category="recent"
      />

      <BoardsGroup
        heading="YOUR WORKSPACES"
        icon={<AiOutlineClockCircle size={22} />}
        boards={boards}
        category="workspaces"
      />
    </>
  )
}

export default BoardList
