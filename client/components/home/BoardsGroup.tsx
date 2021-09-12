import Link from "next/link"
import styled, { css } from "styled-components"

import { AiOutlineStar } from "react-icons/ai"
import { useRouter } from "next/router"
import CreateBoard from "./CreateBoard"
import { ReactNode } from "react"
import { IBoard, useHomeContext } from "../../lib/providers"

interface ITileProps {
  image?: string
}

interface IProps {
  heading: string
  icon: ReactNode
  boards: IBoard[]
  category: "starred" | "workspaces" | "recent"
}

const ListWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-left: 0;
`

export const Tile = styled.li<ITileProps>`
  list-style: none;
  width: 23.5%;
  max-width: 195px;
  min-width: 172px;
  margin: 0 2% 2% 0;
  overflow: hidden;
  width: 100%;

  .home-boards-tile-details {
    background-color: ${props => props?.color};
    background-image: url("${props => props?.image}");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 2px;
    height: 100px;
    width: 100%;
    padding: 6px 8px;

    .home-boards-tile-detail {
      ${props =>
        props.theme.mixins.flex(undefined, "space-between", "flex-end")};
      font-size: 12px;
      color: #fff;
      width: 100%;

      h6 {
        font-size: 13px;
        font-weight: 400;
        color: #fff;
        margin: 0;
      }
    }

    .home-boards-tile-title {
      overflow: hidden;
      text-overflow: ellipsis;
      ${props => props.theme.mixins.lineClamp(2)};
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }

    .home-tile-star {
      visibility: hidden;
      color: #fff;
      z-index: 10;

      &:hover {
        transform: scale(1.2);
        animation-duration: 300ms;

        .home-boards-tile-details {
          pointer-events: none;
        }
      }
    }

    &:hover {
      opacity: 0.8;

      .home-tile-star {
        visibility: visible;
        animation: ${props => props.theme.keyframes.slideInStar};
        animation-duration: 300ms;
      }
    }

    .home-tile-star.active {
      visibility: visible;
      color: ${props => props.theme.colors.amazon};
    }
  }

  a {
    height: 100%;
    z-index: 1;
  }

  @media ${props => props.theme.device.mobileLg} {
    margin: 0 10px 10px 0;
  }

  @media ${props => props.theme.device.mobileXs} {
    margin: 0 8px 10px 0;
    min-width: 100%;
  }
`

const BoardsGroup = ({ heading, icon, boards, category }: IProps) => {
  const router = useRouter()
  const { handleStarBoard } = useHomeContext()

  const handleClick = ev => {
    ev.preventDefault()
    const redirectTo = (ev.target as any)?.id
    router.push(redirectTo)
  }

  return (
    <div className="home-boards-group">
      <div className="home-group-header">
        <div className="home-group-header-icon">{icon}</div>
        <h5 className="home-boards-group-text">{heading}</h5>
      </div>

      <ListWrapper className="d-flex justify-content-flex-start">
        {boards?.map(board => {
          const starred = board?.prefs?.starred === "true"
          return (
            <Tile
              key={board?.id}
              color={board?.prefs?.color}
              image={board?.prefs?.image}
            >
              <button
                id={`/board/${board?.id}`}
                onClick={handleClick}
                className="home-boards-tile-details"
              >
                <div className="home-boards-tile-title">{board?.title}</div>
                <div className="home-boards-tile-detail">
                  <h6>{board?.title}</h6>
                  <div>
                    {
                      <AiOutlineStar
                        className={`home-tile-star ${starred ? "active" : ""}`}
                        size={15}
                        onClick={() => handleStarBoard(board)}
                      />
                    }
                  </div>
                </div>
              </button>
            </Tile>
          )
        })}

        {category === "workspaces" && <CreateBoard />}
      </ListWrapper>
    </div>
  )
}

export default BoardsGroup
