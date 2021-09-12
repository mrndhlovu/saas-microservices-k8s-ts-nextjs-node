import { HTML5Backend } from "react-dnd-html5-backend"
import { DndProvider } from "react-dnd"

import { useBoard, useListContext } from "../../../lib/providers"
import AddList from "./AddList"
import BoardCanvasStyles from "./BoardCanvasStyles"
import ListItem from "./ListItem"

const BoardCanvas = () => {
  const { hasBoardList } = useListContext()
  const { board } = useBoard()

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardCanvasStyles>
        <div className="content">
          {board?.lists?.map(
            (listItem, index) =>
              !listItem.archived && (
                <ListItem
                  key={listItem.id}
                  listIndex={index}
                  listItem={listItem}
                />
              )
          )}
          <AddList
            isFirst={hasBoardList}
            newListPosition={board?.lists.length}
          />
        </div>
      </BoardCanvasStyles>
    </DndProvider>
  )
}

export default BoardCanvas
