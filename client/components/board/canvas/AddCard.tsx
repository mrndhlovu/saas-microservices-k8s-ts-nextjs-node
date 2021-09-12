import { ChangeEvent, useState } from "react"
import { Button, Textarea } from "@chakra-ui/react"
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai"

import { clientRequest } from "../../../api"
import { useGlobalState } from "../../../lib/hooks/context"
import {
  useBoard,
  useListCardsContext,
  useListContext,
} from "../../../lib/providers"

const AddCard = () => {
  const { boardId, findCardsByListId } = useBoard()
  const { updateCardsState } = useListContext()
  const { listId } = useListCardsContext()
  const { notify } = useGlobalState()

  const [editing, setEditing] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")

  const handleChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(ev.target.value)
  }

  const handleSave = async () => {
    if (!title) return
    const [currentListCards] = findCardsByListId(listId)
    const nextCardPosition = currentListCards.length

    await clientRequest
      .createCard({ title, position: nextCardPosition }, { boardId, listId })
      .then(res => {
        updateCardsState(res.data, { isNew: true })
        setTitle("")
        toggleAddInput()
      })
      .catch(err => {
        notify({
          description: err.message,
          placement: "top",
          status: "error",
        })
      })
  }

  const toggleAddInput = () => setEditing(prev => !prev)

  return (
    <div className="create-card">
      <div>
        {editing ? (
          <div className="create-card-wrapper">
            <Textarea
              placeholder="Enter a title for this card..."
              defaultValue={title}
              onChange={handleChange}
              size="sm"
              autoFocus
            />
            <div className="c-flex card">
              <Button size="sm" colorScheme="blue" onClick={handleSave}>
                Add card
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
            size="sm"
            onClick={toggleAddInput}
            leftIcon={<AiOutlinePlus size={18} />}
            isFullWidth
            className="add-card-button"
          >
            Add a card
          </Button>
        )}
      </div>
    </div>
  )
}

export default AddCard
