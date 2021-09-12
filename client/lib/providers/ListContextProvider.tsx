import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react"
import { isArray, isEmpty } from "lodash"
import update from "immutability-helper"

import { clientRequest } from "../../api"
import { IBoard } from "./HomeContextProvider"
import { ICardDraggingProps } from "./ListCardsContextProvider"
import { ICardItem, IListItem } from "../../components/board/canvas/ListItem"
import { useBoard } from "./BoardContextProvider"
import { useGlobalState } from "../hooks/context"

interface IProps {
  children: ReactNode
}

interface IUpdateStateOptions {
  isNew?: boolean
}

const ListContextProvider = ({ children }: IProps) => {
  const { board, boardId, setActiveBoard } = useBoard()
  const { notify } = useGlobalState()

  const dragRef = useRef<ICardItem | null>(null)

  const updateListsState = (
    update: IListItem,
    options?: IUpdateStateOptions
  ) => {
    if (options?.isNew) {
      return setActiveBoard((prev: IBoard) => ({
        ...prev,
        lists: [...prev.lists, update],
      }))
    }

    if (isArray(update)) {
      return setActiveBoard((prev: IBoard) => ({
        ...prev,
        lists: [...update],
      }))
    }

    setActiveBoard((prev: IBoard) => ({
      ...prev,
      lists: prev.lists.map((list: ICardItem) =>
        list.id === update.id ? update : list
      ),
    }))
  }

  const updateCardsState = (
    update: ICardItem | ICardItem[],
    options?: IUpdateStateOptions
  ) => {
    if (options?.isNew) {
      return setActiveBoard((prev: IBoard) => ({
        ...prev,
        cards: [...prev.cards, update],
      }))
    }

    if (isArray(update)) {
      return setActiveBoard((prev: IBoard) => ({
        ...prev,
        cards: update,
      }))
    }

    setActiveBoard((prev: IBoard) => ({
      ...prev,
      cards: prev.cards.map((card: ICardItem) =>
        card.id === update.id ? update : card
      ),
    }))
  }

  const saveListDndChanges = async (data: IListDraggingProps) => {
    if (!data?.sourceListId || !data?.targetListId) return

    await clientRequest.moveList({ ...data, boardId: board.id }).catch(err => {
      notify({
        description: err.message,
        placement: "top",
      })
    })
  }

  const saveCardDndChanges = async (data: ICardDraggingProps) => {
    const dndData = { ...data, boardId: board.id }
    dragRef.current = null
    await clientRequest.moveCard(dndData).catch(err => {
      notify({
        description: err.message,
        placement: "top",
      })
    })
  }

  const switchCardList = useCallback(
    (cardId, hoverListId) => {
      const dragCard = board.cards.find(card => card.id === cardId)
      const cardIndex = board.cards.findIndex(card => card.id === cardId)

      if (!dragCard) return

      const updatedCards = update(board.cards, {
        [cardIndex]: { listId: { $set: hoverListId } },
      })

      updateCardsState(updatedCards)
    },
    [updateCardsState, board?.cards]
  )

  const saveListChanges = useCallback(
    async (listId: string, update: { [key: string]: any }) => {
      await clientRequest
        .updateList(update, { listId, boardId })
        .then(res => updateListsState(res.data))
        .catch(err =>
          notify({
            description: err.message,
            placement: "top",
          })
        )
    },
    [notify, boardId]
  )

  const moveCard = useCallback(
    (dragCardId, targetCardId) => {
      if (dragCardId === undefined || targetCardId === undefined) return

      const dragCard = board.cards.find(card => card.id === dragCardId)
      const dragIndex = board.cards.findIndex(card => card.id === dragCardId)
      const hoverIndex = board.cards.findIndex(card => card.id === targetCardId)

      const updatedCards = update(board.cards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      })

      updateCardsState(updatedCards)
    },
    [board?.cards, updateCardsState]
  )

  const onMoveList = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragList = board.lists[dragIndex]

      const updatedList = update(board.lists, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragList],
        ],
      })

      updateListsState(updatedList)
    },
    [board?.lists, updateListsState]
  )

  return (
    <ListContext.Provider
      value={{
        hasBoardList: !isEmpty(board?.lists),
        moveCard,
        onMoveList,
        saveCardDndChanges,
        saveListChanges,
        saveListDndChanges,
        switchCardList,
        updateCardsState,
        updateListsState,
      }}
    >
      {children}
    </ListContext.Provider>
  )
}

export interface IListDraggingProps {
  sourceListId: string
  targetListId: string
  boardId?: string
}

export interface IListContextProps {
  updateListsState: (
    newListItem: IListItem,
    options?: IUpdateStateOptions
  ) => void
  updateCardsState: (card: ICardItem, options?: IUpdateStateOptions) => void
  sourceIndex?: number
  hasBoardList: boolean
  saveCardDndChanges: (cardItem: ICardDraggingProps) => void
  onMoveList: (
    dragIndex: number,
    hoverIndex: number,
    isActive?: boolean
  ) => void
  saveListDndChanges: (data: IListDraggingProps) => void
  saveListChanges: (listId: string, update: { [key: string]: any }) => void
  switchCardList: (cardId: string, hoverListId: string) => void
  moveCard: (dragCardId: string, hoverCardId: string) => void
}

export const ListContext = createContext({} as IListContextProps)

export const useListContext = () => useContext(ListContext)

export { ListContextProvider }
