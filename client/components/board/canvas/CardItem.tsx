import { useRouter } from "next/router"
import { MouseEvent, useRef } from "react"
import Link from "next/link"
import styled, { css } from "styled-components"

import { FiEdit2 } from "react-icons/fi"
import { Button, Modal, ModalOverlay } from "@chakra-ui/react"

import { useCardContext, useListCardsContext } from "../../../lib/providers"
import CardActions from "./cardActions/CardActions"
import CardModal from "./card/CardModal"
import EditCardMenu from "./EditCardMenu"

export interface ICardCoverProps {
  colorCover?: string
  imageCover?: string
  edgeColor?: string
  height?: string
  width?: string
}

const CardLabel = styled.span<{ color: string }>`
  background-color: ${props => props.color || "none"};
`

const CardCover = styled.div<ICardCoverProps>`
  ${props =>
    props.imageCover
      ? css<ICardCoverProps>`
          background-image: url("${props => props?.imageCover}");
          min-height: 100px;
          background-size: contain;
          height: ${props => (props.height ? `${props.height}px` : "initial")};
          background-color: ${props => props.edgeColor};
          border-radius: 3px 3px 0;
          background-position: 50%;
          background-repeat: no-repeat;
          width: 100%;
          max-height: 270px;

          &.image-cover-full {
            background-position: none;
            background-size: cover;
          }
        `
      : css<ICardCoverProps>`
          background-color: ${props => props.colorCover};
          height: 32px;
        `};
`

interface IProps {
  toggleActionsMenu: () => void
  actionsOpen: boolean
}

const CardItem = ({ toggleActionsMenu, actionsOpen }: IProps) => {
  const { saveCardChanges, listId } = useListCardsContext()
  const {
    card,
    imageCover,
    showCardCover,
    colorCover,
    edgeColor,
    coverUrl,
    coverSize,
  } = useCardContext()
  const { query } = useRouter()
  const { asPath, push } = useRouter()
  const cardLinkRef = useRef<HTMLAnchorElement>()
  const cardModalOpen = query?.activeCard !== undefined

  const handleSave = (title: string) => {
    saveCardChanges(card.id, listId, { title })
    toggleActionsMenu()
  }

  const handleCardClick = (ev: MouseEvent) => {
    push(`${asPath}/?activeCard=${card?.id}/`, undefined, { shallow: true })
  }

  return (
    <Link href="/">
      <>
        {!actionsOpen && (
          <Button onClick={toggleActionsMenu} size="xs" className="edit-button">
            <FiEdit2 size={15} />
          </Button>
        )}
        <a ref={cardLinkRef} onClick={handleCardClick} href="#">
          {showCardCover && (
            <CardCover
              className="list-card-cover"
              imageCover={imageCover || coverUrl}
              edgeColor={edgeColor}
              colorCover={colorCover}
              width={coverSize?.width}
              height={coverSize?.height}
            />
          )}

          {actionsOpen && (
            <CardActions
              close={toggleActionsMenu}
              listId={listId}
              cardId={card.id}
            />
          )}

          <div className={`list-card ${actionsOpen ? "edit-open" : ""}`}>
            <div className="list-card-details">
              <div className="list-card-labels">
                {card?.labels.map((label: string, index: number) => (
                  <CardLabel
                    className="card-label "
                    color={label}
                    key={index}
                  />
                ))}
              </div>

              {actionsOpen ? (
                <EditCardMenu
                  title={card.title}
                  close={toggleActionsMenu}
                  save={handleSave}
                />
              ) : (
                <span className="list-card-title">{card?.title}</span>
              )}
            </div>
          </div>
          <Modal
            size="full"
            isOpen={actionsOpen}
            onClose={toggleActionsMenu}
            closeOnOverlayClick={true}
          >
            <ModalOverlay className="card-editor-overlay" />
          </Modal>
          {cardModalOpen && <CardModal isOpen={cardModalOpen} />}
        </a>
      </>
    </Link>
  )
}

export default CardItem
