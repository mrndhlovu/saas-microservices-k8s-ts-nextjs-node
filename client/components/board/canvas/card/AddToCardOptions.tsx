import { Button } from "@chakra-ui/button"
import { AiOutlineClockCircle } from "react-icons/ai"
import { BsCheckBox, BsTag } from "react-icons/bs"
import { HiOutlinePaperClip } from "react-icons/hi"
import { IoMdCard } from "react-icons/io"

import { UIDropdown } from "../../../shared"
import { useCardContext } from "../../../../lib/providers"
import CardLabels from "../cardActions/CardLabels"
import ChangeCover from "../cardActions/ChangeCover"

const AddToCardOptions = () => {
  const { showCardCover } = useCardContext()

  const ADD_TO_CARD_OPTIONS = [
    { title: "Labels", id: 0, icon: <BsTag />, menu: <CardLabels /> },
    { title: "Dates", id: 1, icon: <AiOutlineClockCircle />, menu: <div /> },
    { title: "Checklist", id: 2, icon: <BsCheckBox />, menu: <div /> },
    { title: "Attachment", id: 3, icon: <HiOutlinePaperClip />, menu: <div /> },
    {
      title: "Cover",
      id: 4,
      icon: <IoMdCard />,
      menu: <ChangeCover />,
      placementAuto: true,
      hidden: showCardCover,
    },
  ]

  return (
    <div className="sidebar-module">
      <h3>Add to Card</h3>
      <div className="buttons-list">
        {ADD_TO_CARD_OPTIONS.map(
          option =>
            !option?.hidden && (
              <UIDropdown
                placement={option?.placementAuto ? "auto" : undefined}
                toggle={
                  <Button
                    key={option.id}
                    leftIcon={option.icon}
                    size="sm"
                    colorScheme="gray"
                    isFullWidth
                  >
                    {option.title}
                  </Button>
                }
                heading={option.title}
              >
                {option.menu}
              </UIDropdown>
            )
        )}
      </div>
    </div>
  )
}

export default AddToCardOptions
