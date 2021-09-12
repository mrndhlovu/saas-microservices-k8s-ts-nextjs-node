import { Divider, Input } from "@chakra-ui/react"
import { ChangeEvent, useEffect, useRef } from "react"
import { MouseEvent, useState } from "react"
import { FiPlus } from "react-icons/fi"
import styled from "styled-components"

import { clientRequest } from "../../../api"
import { useGlobalState } from "../../../lib/hooks/context"
import { IBoard, useBoard } from "../../../lib/providers"
import {
  COLORS_IMAGE,
  LABEL_DEFAULT_OPTIONS,
  PHOTOS_IMAGE,
} from "../../../util/constants"
import { ChangeBgWrapper } from "./DrawerStyles"
import UnSplashImages, { ImageTile } from "./UnSplashImages"

interface IAttachment {
  active?: boolean
  boardId?: string
  edgeColor?: string
  height?: string
  width?: string
  url: string
  id: string
}

const StyleImageTile = styled(ImageTile)``

const ColorOption = styled.div<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  height: 96px;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
`

const ChangeBackground = ({ handleMenuChange, openMenu }) => {
  const inputRef = useRef<HTMLInputElement>()
  const { saveBoardChanges, setActiveBoard, boardId, board } = useBoard()
  const { notify } = useGlobalState()

  const [boardImages, setBoardImages] = useState<IAttachment[]>([])

  const handleSelectedColor = async (ev: MouseEvent) => {
    const updatedBoard = await saveBoardChanges({
      "prefs.color": ev.currentTarget.id,
      activeBg: "color",
    })

    if (!updatedBoard) return

    setActiveBoard((prev: IBoard) => ({
      ...prev,
      activeBg: updatedBoard.activeBg,
      prefs: { ...prev.prefs, color: updatedBoard?.prefs?.color },
    }))
  }

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.currentTarget.files[0]
    if (!file)
      return notify({
        description: "No image found",
        placement: "top",
        status: "info",
      })

    const fileSize = file.size / 1024 / 1024

    if (fileSize > 1)
      return notify({
        description: "Image upload size limit is 1MB",
        placement: "top",
        status: "info",
      })

    const formData = new FormData()
    formData.append("file", file)

    clientRequest
      .uploadBoardBgImage(formData, boardId)
      .then(res => {
        setBoardImages(prev => [...prev, res.data])
        setActiveBoard((prev: IBoard) => ({
          ...prev,
          prefs: { ...prev.prefs, image: res.data.url },
        }))
      })
      .catch(err => {
        notify({
          description: err.message,
          placement: "top",
          status: "error",
        })
      })
  }

  const handleSelectedOption = (ev: MouseEvent) => {
    if (ev.currentTarget.id === "custom") {
      inputRef.current.click()

      return
    }

    handleMenuChange(ev)
  }

  const handleSelectedImage = async (ev: MouseEvent) => {
    const [imageUrl] = ev.currentTarget.id.split("|")
    const response = await saveBoardChanges({
      "prefs.image": imageUrl,
      activeBg: imageUrl === board?.prefs?.image ? "color" : "image",
    })

    if (!response) return

    setActiveBoard((prev: IBoard) => ({
      ...prev,
      activeBg: response.activeBg,
      prefs: { ...prev.prefs, image: response.prefs.image },
    }))
  }

  useEffect(() => {
    const getData = () => {
      clientRequest
        .getBoardImageAttachments(boardId)
        .then(res => setBoardImages(res.data))
        .catch(err => {})
    }

    getData()
  }, [])

  return (
    <ChangeBgWrapper colors={COLORS_IMAGE} photos={PHOTOS_IMAGE}>
      {openMenu === "changeColor" && (
        <>
          <div className="tiles-wrapper">
            <div id="photo" onClick={handleSelectedOption} className="tile">
              <div className="tile-image" />
              <span className="">Photos</span>
            </div>
            <div id="colors" onClick={handleSelectedOption} className="tile">
              <div className="tile-colors" />
              <span className="">Colors</span>
            </div>
          </div>
          <Divider className="divider" />

          <h2>Custom</h2>

          <div className="tiles-wrapper custom">
            <div
              id="custom"
              onClick={handleSelectedOption}
              className="tile custom"
            >
              <div className="tile-custom" />
              <FiPlus size={22} />
              <Input
                className="image-upload"
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                multiple={false}
              />
            </div>
            {boardImages.map((image, index) => (
              <StyleImageTile
                onClick={handleSelectedImage}
                id={image?.url}
                key={index}
                bgImage={image?.url}
              />
            ))}
          </div>
        </>
      )}

      {openMenu === "photo" && (
        <UnSplashImages handleSelectedImage={handleSelectedImage} />
      )}

      {openMenu === "colors" && (
        <div className="colors-wrapper">
          {LABEL_DEFAULT_OPTIONS.map((option, index) => (
            <ColorOption
              onClick={handleSelectedColor}
              id={option.color}
              key={index}
              bgColor={option.color}
              className="color-option"
            />
          ))}
        </div>
      )}
    </ChangeBgWrapper>
  )
}

export default ChangeBackground
