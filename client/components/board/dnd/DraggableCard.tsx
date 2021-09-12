import { memo, ReactNode, useRef, useMemo, useState } from "react"
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd"
import { XYCoord } from "dnd-core"

import { DRAG_TYPES } from "../../../util/constants"
import {
  ICardDraggingProps,
  useCardContext,
  useListContext,
} from "../../../lib/providers"
import CardItem from "../canvas/CardItem"

export interface DragItemProps {
  id: string
  children: ReactNode
  index: number
}

export interface ICardDndItem {
  cardId: string

  index: number
  hoverIndex: number
  targetId: string

  hoverListIndex?: number
  sourceListIndex: number

  sourceListId?: string
  targetListId?: string
}

const typedMemo: <T>(Component: T) => T = memo

const getClass = (isDragging: boolean, actionsOpen?: boolean) => {
  switch (true) {
    case isDragging && !actionsOpen:
      return "drag-placeholder"

    case actionsOpen && !isDragging:
      return "card-item actions-active"
    default:
      return "card-item"
  }
}

const DraggableCard = typedMemo(() => {
  const { saveCardDndChanges, moveCard } = useListContext()
  const { cardId, cardIndex, listIndex, listId } = useCardContext()

  const ref = useRef<HTMLDivElement>(null)

  const [actionsOpen, setActionsOpen] = useState<boolean>(false)

  const toggleActionsMenu = () => setActionsOpen(prev => !prev)

  const [{ isDragging }, drag] = useDrag({
    item: {
      sourceListIndex: listIndex,
      cardId: cardId,
      index: cardIndex,
      targetId: cardId,
      hoverIndex: cardIndex,
      sourceListId: listId,
      targetListId: listId,
    },
    type: DRAG_TYPES.CARD,
    collect: monitor => {
      return {
        isDragging: !!monitor.isDragging(),
      }
    },
  })

  const [{ isOver }, drop] = useDrop({
    accept: DRAG_TYPES.CARD,
    collect: monitor => {
      return {
        isOver: !!monitor.isOver(),
      }
    },
    drop(item: ICardDndItem) {
      if (item.targetListId === item.sourceListId) {
        const data: ICardDraggingProps = {
          sourceCardId: item.cardId,
          targetCardId: item.targetId,
          sourceListId: item.sourceListId,
        }

        saveCardDndChanges(data)
      }

      return {}
    },
    hover(item: ICardDndItem, monitor: DropTargetMonitor) {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = cardIndex
      const hoverCardId = cardId

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const clientOffset = monitor.getClientOffset()

      const isOnSourceCard = dragIndex === hoverIndex

      if (isOnSourceCard) return

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveCard(item.cardId, hoverCardId)

      item.index = hoverIndex
      item.targetId = hoverCardId
    },
  })

  drag(drop(ref))

  return (
    <div
      id="card-item"
      className={getClass(isOver || isDragging, actionsOpen)}
      ref={ref}
    >
      <CardItem
        toggleActionsMenu={toggleActionsMenu}
        actionsOpen={actionsOpen}
      />
    </div>
  )
})

export default DraggableCard
