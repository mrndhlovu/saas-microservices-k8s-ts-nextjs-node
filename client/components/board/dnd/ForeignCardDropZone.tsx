import { useRef } from "react"
import { useDrop } from "react-dnd"

import { DRAG_TYPES } from "../../../util/constants"
import { ICardDndItem } from "./DraggableCard"
import { ICardDraggingProps, useListContext } from "../../../lib/providers"

const ForeignCardDropZone = ({ children, listId, listIndex }) => {
  const { saveCardDndChanges, switchCardList } = useListContext()

  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: DRAG_TYPES.CARD,
    drop(item: ICardDndItem) {
      if (item.targetListId !== item.sourceListId) {
        const data: ICardDraggingProps = {
          sourceCardId: item.cardId,
          targetCardId: item.targetId,
          sourceListId: item.sourceListId,
          targetListId: item.targetListId,
          isSwitchingList: true,
        }
        saveCardDndChanges(data)
      }

      return {}
    },
    hover(item: ICardDndItem) {
      const sourceListIndex = item.sourceListIndex
      const listHoverIndex = listIndex
      const isOnSourceList = sourceListIndex === listHoverIndex

      if (isOnSourceList) return

      switchCardList(item.cardId, listId)
      item.targetListId = listId
      item.sourceListIndex = listIndex
    },
  })

  drop(ref)

  return (
    <div className="foreign-card-dnd-zone" ref={ref}>
      {children}
    </div>
  )
}

export default ForeignCardDropZone
