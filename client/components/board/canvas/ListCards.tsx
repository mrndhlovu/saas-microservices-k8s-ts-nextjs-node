import { useBoard } from "../../../lib/providers"
import { CardContextProvider } from "../../../lib/providers/CardContextProvider"

import DraggableCard from "../dnd/DraggableCard"

const ListCards = ({ listIndex, listId }) => {
  const { board, boardId } = useBoard()

  return (
    <div className="list-cards">
      {board?.cards?.map(
        (card, index) =>
          card?.id &&
          !card?.archived &&
          card.listId === listId && (
            <CardContextProvider
              listId={listId}
              listIndex={listIndex}
              key={card?.id}
              card={card}
              cardIndex={index}
            >
              <DraggableCard />
            </CardContextProvider>
          )
      )}
    </div>
  )
}

export default ListCards
