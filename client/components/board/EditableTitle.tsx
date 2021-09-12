import { Button, Input } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"

interface IProps {
  handleUpdate: (newTitle: string) => void
  title: string
}

const EditableTitle = ({ handleUpdate, title }: IProps) => {
  const [editing, setEditing] = useState<boolean>(false)
  const [newBoardTitle, setNewBoardTitle] = useState<string>("")

  const toggleEditTitle = () => setEditing(prev => !prev)

  const handleEditTitle = () => {
    if (newBoardTitle && newBoardTitle !== title) {
      handleUpdate(newBoardTitle)
    }
    toggleEditTitle()
  }

  const handleChangeTitle = (ev: ChangeEvent<HTMLElement>) => {
    setNewBoardTitle((ev.target as any).value)
  }

  return (
    <>
      {!editing ? (
        <Button
          className="edit-title-button"
          isFullWidth
          size="sm"
          onClick={toggleEditTitle}
          autoFocus={false}
        >
          {title}
        </Button>
      ) : (
        <Input
          onChange={handleChangeTitle}
          onBlur={handleEditTitle}
          defaultValue={title}
          size="sm"
        />
      )}
    </>
  )
}

export default EditableTitle
