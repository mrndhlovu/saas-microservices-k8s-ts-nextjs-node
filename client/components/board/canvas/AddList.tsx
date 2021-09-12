import { ChangeEvent, useState } from "react"
import { Button, Input } from "@chakra-ui/react"
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai"

import { clientRequest } from "../../../api"
import { useGlobalState } from "../../../lib/hooks/context"
import { IBoard, useBoard } from "../../../lib/providers"

interface IProps {
  isFirst: boolean
  newListPosition: number
}

const AddList = ({ isFirst, newListPosition }: IProps) => {
  const { boardId, setActiveBoard } = useBoard()
  const { notify } = useGlobalState()

  const [editing, setEditing] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setTitle(ev.target.value)
  }

  const handleSave = async () => {
    if (!title) return

    await clientRequest
      .createList({ title, position: newListPosition }, boardId)
      .then(res => {
        setActiveBoard((prev: IBoard) => ({
          ...prev,
          lists: [...prev.lists, res.data],
        }))
        setTitle("")
        toggleAddInput()
      })
      .catch(err =>
        notify({
          description: err.message,
          placement: "top",
        })
      )
  }

  const toggleAddInput = () => setEditing(prev => !prev)

  return (
    <div className="list-wrapper">
      <div className="create-list">
        <div className="create-list-content">
          {editing ? (
            <div className="create-list-wrapper">
              <Input
                placeholder="Add list title..."
                defaultValue={title}
                onChange={handleChange}
                size="sm"
                autoFocus
              />
              <div className="c-flex">
                <Button size="sm" colorScheme="blue" onClick={handleSave}>
                  Add list
                </Button>
                <AiOutlineClose
                  cursor="pointer"
                  onClick={toggleAddInput}
                  size={20}
                />
              </div>
            </div>
          ) : (
            <Button
              onClick={toggleAddInput}
              className="create-button"
              leftIcon={<AiOutlinePlus size={18} />}
              size="md"
            >
              {isFirst ? "Add a list" : "Add another list"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddList
