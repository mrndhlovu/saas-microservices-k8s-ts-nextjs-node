import { MouseEvent } from "react"
import { Button, Input, Divider } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { ChangeEvent, useRef } from "react"
import styled from "styled-components"

import { clientRequest } from "../../../../api"
import { useGlobalState } from "../../../../lib/hooks/context"
import {
  useCardContext,
  useListCardsContext,
  useListContext,
} from "../../../../lib/providers"
import { LABEL_DEFAULT_OPTIONS } from "../../../../util/constants"
import UnSplashImages from "../../sidebar/UnSplashImages"
import CardActionStyles from "./CardActionStyles"

export interface IAttachment {
  [key: string]: any
  url: string
  edgeColor: string
  height: string
  width: string
  active?: boolean
}

const StyledLi = styled.li<{ bgColor: string }>`
  .card-label-color {
    background-color: ${props => props.bgColor};
    height: 32px;
    margin: 0 8px 8px 0;
    padding: 0;
    width: 48px;
    cursor: pointer;
    border-radius: 3px;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
`

const AttachmentImage = styled.div<{ image: IAttachment }>`
  background-image: url("${props => props?.image?.url}");
  background-size: contain;
  background-color: ${props => props.image.edgeColor};
  border-radius: 3px;
  background-position: center;
  background-repeat: no-repeat;
  width: 88px;
  height: 48px;
`

const ChangeCover = () => {
  const { cardId, card } = useCardContext()
  const { notify } = useGlobalState()
  const { listId, saveCardChanges } = useListCardsContext()
  const { updateCardsState } = useListContext()

  const imageRef = useRef<HTMLInputElement>()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<IAttachment[]>([])
  const [search, setSearch] = useState<boolean>(false)

  const handleSelectedCardColor = (ev: MouseEvent) => {
    const colorCover = ev.currentTarget.id

    saveCardChanges(cardId, listId, { colorCover })
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

    setIsLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    clientRequest
      .uploadImageCardCover(formData, cardId)
      .then(res => {
        setAttachments(prev => [...prev, res.data])
        updateCardsState({ ...card, imageCover: res.data })
      })
      .catch(err => {
        notify({
          description: err.message,
          placement: "top",
          status: "error",
        })
      })
  }

  const handleSelectedImage = (ev: MouseEvent) => {
    const [, edgeColor, thumbnail] = ev.currentTarget.id.split("|")

    saveCardChanges(cardId, listId, { coverUrl: thumbnail, edgeColor })
  }

  const toggleSearch = () => setSearch(prev => !prev)

  const handleAttachmentChange = (ev: MouseEvent) => {
    const attachmentId = ev.currentTarget.id

    saveCardChanges(cardId, listId, { imageCover: attachmentId })
  }

  const handleUploadImage = () => {
    imageRef.current.click()
  }

  const handleRemoveCover = () => {
    saveCardChanges(cardId, listId, { imageCover: "" })
  }

  useEffect(() => {
    const getData = () => {
      clientRequest
        .getCardAttachments(cardId)
        .then(res => setAttachments(res.data))
        .catch(err =>
          notify({
            description: err.message,
            placement: "top",
            status: "error",
          })
        )
    }

    getData()
  }, [])

  return (
    <CardActionStyles>
      {search ? (
        <div className="search-list">
          <div className="image-list search">
            <UnSplashImages handleSelectedImage={handleSelectedImage} />
          </div>
          <div className="list-footer ">
            <Button size="sm" onClick={toggleSearch} colorScheme="gray">
              Back
            </Button>

            <div>
              Images from{" "}
              <a target="_blank" href="https://unsplash.com">
                Unsplash
              </a>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="cover-size">
            <Button
              size="sm"
              onClick={handleRemoveCover}
              isFullWidth
              colorScheme="gray"
            >
              Remove cover
            </Button>
          </div>
          <h4>Colors</h4>
          <ul className="confirm-label">
            {LABEL_DEFAULT_OPTIONS.map((label, index) => (
              <StyledLi
                className="item-selected"
                key={index}
                bgColor={label.color}
                onClick={handleSelectedCardColor}
                id={label.color}
              >
                <span className="card-label-color"></span>
              </StyledLi>
            ))}
          </ul>
          <h4>Attachments</h4>
          <li className="attachment-list">
            {attachments.map(attachment => (
              <a href="#" key={attachment.id}>
                <AttachmentImage
                  id={attachment.id}
                  onClick={handleAttachmentChange}
                  image={attachment}
                />
              </a>
            ))}
          </li>
          <Button
            size="sm"
            onClick={handleUploadImage}
            isFullWidth
            colorScheme="gray"
          >
            Upload a cover image
          </Button>
          <Input
            className="image-upload"
            ref={imageRef}
            type="file"
            accept="image/*"
            name="davidg"
            onChange={handleChange}
            multiple={false}
          />
          <small>Tip: Drag an image on to the card to upload it</small>

          <Divider className="divider" />

          <div className="image-list">
            <UnSplashImages
              handleSelectedImage={handleSelectedImage}
              showSearchInput={false}
              perPage={6}
              infiniteScroll={false}
            />

            <Button
              size="sm"
              onClick={toggleSearch}
              isFullWidth
              colorScheme="gray"
            >
              Search for photos
            </Button>
          </div>
        </>
      )}
    </CardActionStyles>
  )
}

export default ChangeCover
