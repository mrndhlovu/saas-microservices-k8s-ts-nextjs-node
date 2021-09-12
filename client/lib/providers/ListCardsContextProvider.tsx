import { createContext, ReactNode, useCallback, useContext } from "react"
import { clientRequest } from "../../api"
import { useGlobalState } from "../hooks/context"

import { useBoard } from "./BoardContextProvider"
import { useListContext } from "./ListContextProvider"

interface IProps {
  listId: string
  listIndex: number
  children: ReactNode
}

export interface ICardDraggingProps {
  sourceCardId: string
  targetCardId: string
  sourceListId?: string
  targetListId?: string
  boardId?: string
  isSwitchingList?: boolean
}

export interface IDndProps {
  isSwitchingList?: boolean
}

const ListCardsContextProvider = ({ children, listId, listIndex }: IProps) => {
  const { findCardsByListId } = useBoard()
  const { updateCardsState } = useListContext()
  const { notify } = useGlobalState()

  const [, listHasCards] = findCardsByListId(listId)

  const saveCardChanges = useCallback(
    async (cardId: string, listId: string, update: { [key: string]: any }) => {
      await clientRequest
        .updateCard(update, { listId, cardId })
        .then(res => updateCardsState(res.data))
        .catch(err =>
          notify({
            description: err.message,
            placement: "top",
          })
        )
    },
    [notify, updateCardsState]
  )

  return (
    <ListCardContext.Provider
      value={{
        listIndex,
        listHasCards,
        listId,
        saveCardChanges,
      }}
    >
      {children}
    </ListCardContext.Provider>
  )
}

export interface IListCardsContextProps {
  listHasCards: boolean
  listIndex?: number
  listId: string
  saveCardChanges: (
    cardId: string,
    listId: string,
    update: { [key: string]: any }
  ) => void
}

const ListCardContext = createContext({} as IListCardsContextProps)
export const useListCardsContext = () => useContext(ListCardContext)

export { ListCardsContextProvider }
