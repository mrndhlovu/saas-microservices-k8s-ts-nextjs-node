import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useRouter } from "next/router"
import { isArray, isEmpty } from "lodash"

import { clientRequest } from "../../api"
import { IBoard } from "./HomeContextProvider"
import { ICardItem, IListItem } from "../../components/board/canvas/ListItem"
import { ROUTES } from "../../util/constants"
import { useGlobalState } from "../hooks/context"

interface IProps {
  board?: IBoard
  children: ReactNode
}

interface IUpdateStateOptions {
  isNew?: boolean
}

const BoardContextProvider = ({ children, board }: IProps) => {
  if (!board) return null

  const { notify } = useGlobalState()
  const router = useRouter()

  const [activeBoard, setActiveBoard] = useState<IProps["board"]>()
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const isStarred = Boolean(activeBoard?.prefs?.starred === "true")

  const saveBoardChanges = useCallback(
    async (update: IBoard) => {
      return await clientRequest
        .updateBoard(update, activeBoard.id)
        .then(res => res.data as IBoard)
        .catch(err => {
          notify({ description: err.message, status: "error" })
          return
        })
    },
    [activeBoard, notify]
  )

  const updateBoardState = (update: IBoard, options?: IUpdateStateOptions) => {
    if (options?.isNew) {
      return router.push(`/${ROUTES.board}/${update.id}`)
    }

    setActiveBoard(update)
  }

  const handleStarBoard = useCallback(async () => {
    const update = {
      "prefs.starred": !Boolean(activeBoard?.prefs!?.starred === "true"),
    }

    const response = await saveBoardChanges(update)
    if (!response) return

    setActiveBoard(prev => ({
      ...prev,
      prefs: {
        ...prev.prefs,
        starred: response?.prefs?.starred,
      },
    }))
  }, [saveBoardChanges])

  const handleDeleteBoard = async () => {
    await clientRequest
      .deleteBoard(activeBoard.id)
      .then(() => router.push(ROUTES.home))
      .catch(err => {
        notify({ description: err.message })
      })
  }

  const findCardsByListId = useCallback(
    (id: string): [ICardItem[], boolean] => {
      const cards = board.cards.filter((card: ICardItem) => card?.listId === id)
      const hasCards = !isEmpty(cards)
      return [cards, hasCards]
    },
    [board?.cards]
  )

  const findListById = useCallback(
    (id: string): [IListItem, boolean] => {
      const list = board.lists.find((list: IListItem) => list?.id === id)
      const hasCards = !isEmpty(list?.cards)
      return [list, hasCards]
    },
    [board?.lists]
  )

  const closeBoard = async () => {
    await clientRequest
      .updateBoard({ archived: "true" }, activeBoard.id)

      .then(() => router.push(ROUTES.home))
      .catch(err => {
        notify({ description: err.message })
      })
  }

  const toggleDrawerMenu = () => setDrawerOpen(prev => !prev)

  useEffect(() => {
    setActiveBoard(board)
  }, [])

  return (
    <BoardContext.Provider
      value={{
        board: activeBoard,
        drawerOpen,
        isStarred,
        handleDeleteBoard,
        handleStarBoard,
        toggleDrawerMenu,
        closeBoard,
        setActiveBoard,
        findCardsByListId,
        findListById,
        saveBoardChanges,
        boardId: board.id,
        updateBoardState,
      }}
    >
      {children}
    </BoardContext.Provider>
  )
}

interface IBoardContext {
  handleStarBoard: (board?: IBoard) => void
  saveBoardChanges: (board?: IBoard) => Promise<IBoard | void>
  boards?: IBoard[]
  board?: IBoard
  handleDeleteBoard: () => void
  findCardsByListId: (listId: string) => [IBoard["cards"]?, boolean?]
  findListById: (listId: string) => [IListItem?, boolean?]

  drawerOpen: boolean
  isStarred: boolean
  toggleDrawerMenu: () => void
  closeBoard: () => void
  setActiveBoard: (board?: IBoard) => void
  updateBoardState: (board?: IBoard) => void
  boardId: string
}

export const BoardContext = createContext<IBoardContext>({} as IBoardContext)
export const useBoard = () => useContext(BoardContext)

export { BoardContextProvider }
