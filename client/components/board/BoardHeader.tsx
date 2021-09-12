import { ChangeEvent, memo, useState } from "react"
import { Button, Input } from "@chakra-ui/react"
import { AiOutlineEllipsis } from "react-icons/ai"
import { FiStar } from "react-icons/fi"
import styled from "styled-components"

import { UIDropdown } from "../shared"
import { IBoard, useBoard } from "../../lib/providers"
import PowerUpButtons from "./PowerUpButtons"

interface IStyleProps {
  starred: boolean
}

const Container = styled.div<IStyleProps>`
  ${props => props.theme.mixins.flex("row", "space-between")};
  margin-bottom: 7px;
  padding: 3px 10px;
  width: 100%;

  .star-icon {
    color: ${props => (props.starred ? props.theme.colors.amazon : "#fff")};
  }

  .dropdown {
    padding: 0;
    background-color: rgb(0 0 0 / 13%);
  }

  .board-header-right-icons,
  .board-header-left-icons {
    display: flex;
    gap: 3px;

    button {
      border-radius: 3px;
      border: 0;
      text-decoration: none;
      align-items: center;
      background-color: rgb(0 0 0 / 13%);
      box-shadow: none;
      color: #ffffff;
      display: flex;
      font-weight: lighter;
      height: 32px;
      line-height: 32px;
      white-space: nowrap;
    }
  }

  input {
    max-width: 200px;
  }
`

const BoardHeader = () => {
  const {
    board,
    toggleDrawerMenu,
    setActiveBoard,
    handleStarBoard,
    saveBoardChanges,
    isStarred,
  } = useBoard()

  const [newBoardTitle, setNewBoardTitle] = useState<string>("")
  const [editing, setEditing] = useState<boolean>(false)

  const handleEditTitle = () => {
    if (newBoardTitle && newBoardTitle !== board?.title) {
      const response = saveBoardChanges({ title: newBoardTitle })
      if (!response) return
      setActiveBoard((prev: IBoard) => ({ ...prev, title: newBoardTitle }))
    }
    toggleEditTitle()
  }

  const handleChangeTitle = (ev: ChangeEvent<HTMLElement>) => {
    setNewBoardTitle((ev.target as any).value)
  }

  const toggleEditTitle = () => setEditing(prev => !prev)

  return (
    <Container starred={isStarred}>
      <div className="board-header-left-icons">
        {!editing ? (
          <Button onClick={toggleEditTitle}>{board?.title}</Button>
        ) : (
          <Input
            onChange={handleChangeTitle}
            onBlur={handleEditTitle}
            defaultValue={board?.title}
            size="sm"
          />
        )}

        <Button size="sm" onClick={handleStarBoard}>
          <FiStar className="star-icon" />
        </Button>

        <UIDropdown
          heading="Invite to board"
          toggle={
            <span>
              <Button size="sm">Invite</Button>
            </span>
          }
        >
          <Input placeholder="Email address or username" />
        </UIDropdown>
      </div>

      <div className="board-header-right-icons">
        <PowerUpButtons />
        <Button
          size="sm"
          onClick={toggleDrawerMenu}
          leftIcon={<AiOutlineEllipsis />}
        >
          Show menu
        </Button>
      </div>
    </Container>
  )
}

export default memo(BoardHeader)
