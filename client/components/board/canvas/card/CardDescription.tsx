import { Button } from "@chakra-ui/button"
import { Textarea } from "@chakra-ui/textarea"
import { ChangeEvent, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { GrTextAlignFull } from "react-icons/gr"

import { useCardContext, useListCardsContext } from "../../../../lib/providers"
import CardModule from "./CardModule"

const CardDescription = () => {
  const { card, cardId } = useCardContext()

  const [editing, setEditing] = useState<boolean>(false)
  const [description, setDescription] = useState<string>("")
  const { saveCardChanges, listId } = useListCardsContext()

  const handleSave = () => {
    if (!description) return
    saveCardChanges(cardId, listId, { description })
    toggleEditOption()
  }

  const toggleEditOption = () => setEditing(prev => !prev)

  const handleChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(ev.target.value)
  }

  return (
    <div className="card-description module">
      <CardModule
        icon={<GrTextAlignFull size={22} />}
        className="description"
        title="Description"
        option={
          card?.description ? (
            <Button onClick={toggleEditOption} size="sm" colorScheme="gray">
              Edit
            </Button>
          ) : null
        }
      />
      {!editing && !card?.description && (
        <p className="module-content" onClick={toggleEditOption}>
          Add a more detailed description...
        </p>
      )}

      {card?.description && !editing && (
        <p className="module-content description">{card.description}</p>
      )}

      {editing && (
        <div className="description-edit module-content ">
          <Textarea
            placeholder="Add a more detailed description..."
            onChange={handleChange}
            defaultValue={card?.description || description}
          />
          <div className="save-btn">
            <Button onClick={handleSave} size="sm" colorScheme="blue">
              Save
            </Button>
            <AiOutlineClose onClick={toggleEditOption} size={22} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CardDescription
