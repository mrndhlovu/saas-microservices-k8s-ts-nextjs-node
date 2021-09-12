import { ChangeEvent, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { Button, Textarea } from "@chakra-ui/react"

interface IProps {
  title: string
  close: () => void
  save: (newTitle: string) => void
}

const EditCardMenu = ({ title, close, save }: IProps) => {
  const [newTitle, setNewTitle] = useState<string>("")

  const handleChange = (ev: ChangeEvent<HTMLElement>) => {
    setNewTitle((ev.target as any).value)
  }

  const handleSave = () => {
    if (newTitle && newTitle !== title) {
      save(newTitle)
    }
  }

  return (
    <div className="card-editor">
      <div className="card-editor-content">
        <Textarea onChange={handleChange} defaultValue={title} />
      </div>
      <div className="action-buttons">
        <Button size="sm" onClick={handleSave} colorScheme="blue">
          Save
        </Button>
        <AiOutlineClose size={22} className="close-button" onClick={close} />
      </div>
    </div>
  )
}

export default EditCardMenu
