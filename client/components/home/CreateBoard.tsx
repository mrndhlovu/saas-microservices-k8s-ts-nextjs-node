import { useCallback } from "react"
import { useState } from "react"
import { AiOutlineQuestionCircle } from "react-icons/ai"
import styled from "styled-components"

import { Tooltip } from "@chakra-ui/react"

import { upgradeToolTipText } from "../../util/copy"
import NewBoardModal from "./NewBoardModal"

const CreateBoardTile = styled.li`
  width: 23.5%;
  padding: 0;
  margin: 0 2% 2% 0;
  transform: translate(0);
  position: relative;
  cursor: pointer;
  list-style: none;
  max-width: 195px;
  min-width: 195px;

  .create-board {
    background-color: rgba(9, 30, 66, 0.04);
    border: none;
    color: #172b4d;
    display: table-cell;
    height: 100px;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    width: inherit;
    transition-property: background-color, border-color, box-shadow;
    transition-duration: 85ms;
    transition-timing-function: ease;
    border-radius: 3px;
    background-size: cover;
    background-position: 50%;
    line-height: 20px;
    position: relative;
    text-decoration: none;

    p {
      margin: 0;
      span {
        color: #172b4d;
        font-weight: 400;
        text-align: center;
        font-size: 14px;
      }

      .create-board-remaining {
        font-size: 13px;
      }
    }

    svg {
      position: absolute;
      bottom: 8px;
      right: 8px;
    }
  }

  @media ${props => props.theme.device.mobileXs} {
    margin: 0 8px 10px 0;
    min-width: 100%;
  }
`

const StyledTooltip = styled(Tooltip)`
  background-color: #fff;
`

const CreateBoard = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)

  const toggleModal = useCallback(() => setOpenModal(prev => !prev), [])

  return (
    <>
      <CreateBoardTile onClick={toggleModal} className="create-board-tile">
        <div className="create-board">
          <p>
            <span className="create-board-title">Create new board</span>
          </p>
          <p>
            <span className="create-board-remaining">{`2 remaining`}</span>
          </p>

          <Tooltip
            hasArrow
            bg="gray.300"
            placement="top"
            color="black"
            label={upgradeToolTipText(8)}
          >
            <AiOutlineQuestionCircle size={15} />
          </Tooltip>
        </div>
      </CreateBoardTile>
      {openModal && (
        <NewBoardModal openModal={openModal} toggleModal={toggleModal} />
      )}
    </>
  )
}

export default CreateBoard
