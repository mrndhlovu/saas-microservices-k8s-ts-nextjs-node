import { Button } from "@chakra-ui/button"
import { Portal } from "@chakra-ui/portal"
import { HiOutlineArrowRight, HiOutlineTemplate } from "react-icons/hi"
import { MdContentCopy } from "react-icons/md"
import { VscArchive } from "react-icons/vsc"

import { UIDropdown } from "../../../shared"

const ModalCardActions = () => {
  const ADD_TO_CARD_OPTIONS = [
    { title: "Move", id: 0, icon: <HiOutlineArrowRight />, menu: <div /> },
    { title: "Copy", id: 1, icon: <MdContentCopy />, menu: <div /> },
    {
      title: "Make template",
      id: 2,
      icon: <HiOutlineTemplate />,
      menu: <div />,
    },
    { title: "Archive", id: 3, icon: <VscArchive />, menu: <div /> },
  ]

  return (
    <div className="sidebar-module">
      <h3>Action</h3>
      <div className="buttons-list">
        {ADD_TO_CARD_OPTIONS.map(option => (
          <UIDropdown
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
            <Portal>{option.menu}</Portal>
          </UIDropdown>
        ))}
      </div>
    </div>
  )
}

export default ModalCardActions
