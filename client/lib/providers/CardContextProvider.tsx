import { useRouter } from "next/router"
import { createContext, ReactNode, useContext } from "react"
import { ICardItem } from "../../components/board/canvas/ListItem"
import { ROUTES } from "../../util/constants"
import { useBoard } from "./BoardContextProvider"

interface IProps {
  card: ICardItem
  children: ReactNode
  cardIndex: number
  listId: string
  listIndex: number
}

const CardContextProvider = ({
  card,
  children,
  cardIndex,
  listId,
  listIndex,
}: IProps) => {
  const { boardId } = useBoard()
  const { replace } = useRouter()

  const showCardCover =
    card?.colorCover || card?.imageCover?.active || card?.coverUrl?.active

  const imageCover = card?.imageCover?.active
    ? card?.imageCover
    : card?.coverUrl?.active
    ? card?.coverUrl
    : ""

  const edgeColor = card?.imageCover?.active
    ? card?.imageCover?.edgeColor
    : card?.coverUrl?.edgeColor

  const closeCardModal = () => {
    replace(`/${ROUTES.board}/${boardId}`)
  }

  return (
    <CardContext.Provider
      value={{
        card,
        cardId: card.id,
        imageCover: card?.imageCover?.active ? card?.imageCover?.url : "",
        coverUrl: card?.coverUrl?.active ? card?.coverUrl?.image : "",
        edgeColor,
        cardIndex,
        coverSize: {
          width: imageCover?.width,
          height: imageCover?.height || "200",
        },
        listId,
        listIndex,
        closeCardModal,
        showCardCover,
        colorCover: card?.colorCover,
      }}
    >
      {children}
    </CardContext.Provider>
  )
}

interface ICardContext {
  card: ICardItem
  cardId: string
  listId: string
  listIndex: number
  cardIndex: number
  closeCardModal: () => void
  showCardCover: string
  imageCover?: string
  colorCover?: string
  coverUrl?: string
  edgeColor?: string
  coverSize?: {
    width: string
    height: string
  }
}

export const CardContext = createContext<ICardContext>({} as ICardContext)
export const useCardContext = () => useContext(CardContext)

export { CardContextProvider }
