import { memo, ReactNode, useRef, useMemo } from "react"
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd"
import { XYCoord } from "dnd-core"

import { DRAG_TYPES } from "../../../util/constants"
import { IListDraggingProps, useListContext } from "../../../lib/providers"

export interface DragItemProps {
  listId: string
  onMoveItem?: (hoverId: string, id: string) => void
  children: ReactNode
  index: number
}

export interface IListDndItem {
  sourceIndex: number
  sourceId: string

  hoveIndex: number
  hoverId: string
}

const typedMemo: <T>(Component: T) => T = memo

const DraggableList = typedMemo(({ children, listId, listIndex }) => {
  const { saveListDndChanges, onMoveList } = useListContext()
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    item: () => {
      return { sourceIndex: listIndex, sourceId: listId, hoveIndex: listIndex }
    },
    type: DRAG_TYPES.LIST,
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: DRAG_TYPES.LIST,
    collect(monitor) {
      return {
        isOver: !!monitor.isOver(),
      }
    },
    drop(item: IListDndItem) {
      const data: IListDraggingProps = {
        sourceListId: item.sourceId,
        targetListId: item.hoverId,
      }
      saveListDndChanges(data)

      return {}
    },

    hover(item: IListDndItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.hoveIndex
      const hoverIndex = listIndex

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleX =
        (hoverBoundingRect.left - hoverBoundingRect.right) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.right

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }

      onMoveList(dragIndex, hoverIndex)

      item.hoveIndex = hoverIndex
      item.hoverId = listId
    },
  })

  const containerStyle = useMemo(
    () => ({
      cursor: "pointer",
      borderRadius: "3px",
    }),
    [isDragging]
  )

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`${isDragging ? "drag-placeholder" : "list-item"}`}
    >
      {children}
    </div>
  )
})

export default DraggableList
