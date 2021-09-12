import { BsCheck } from "react-icons/bs"
import { Button, Divider, Input } from "@chakra-ui/react"
import { ChangeEvent, MouseEvent, useState } from "react"
import { FiEdit2 } from "react-icons/fi"
import { useEffect } from "react"
import { useRef } from "react"
import styled from "styled-components"

import { clientRequest } from "../../../../api"
import { getLabelOptions } from "../../../../util"
import { LABEL_DEFAULT_OPTIONS } from "../../../../util/constants"
import { useCardContext, useListCardsContext } from "../../../../lib/providers"
import { useGlobalState } from "../../../../lib/hooks/context"
import CardActionStyles from "./CardActionStyles"

export interface ILabelProps {
  color: string
  id?: string
  cardId?: string
  name?: string
}

interface IProps {
  showCancelButton?: boolean
}

const StyledLi = styled.li<{ bgColor: string; checked: boolean }>`
  .label-color {
    background-color: ${props => props.bgColor};
  }

  .check-icon {
    visibility: ${props => (props.checked ? "visible" : "hidden")};
  }
`

const CardLabels = ({ showCancelButton }: IProps) => {
  const { card, cardId } = useCardContext()
  const { saveCardChanges, listId } = useListCardsContext()
  const { notify } = useGlobalState()
  const inputRef = useRef<HTMLInputElement | null>()

  const [selectedLabel, setSelectedLabel] = useState<ILabelProps>(
    {} as ILabelProps
  )

  const [labelName, setLabelName] = useState<string>("")
  const [savedLabels, setSavedLabels] = useState<ILabelProps[]>([])
  const [createLabel, setCreateLabel] = useState<boolean>()

  const [labelOptions, setLabelOptions] = useState<ILabelProps[]>(
    getLabelOptions(savedLabels, true)
  )

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setLabelName(ev.target.value)
  }

  const handleSelectedLabel = (ev: MouseEvent) => {
    ev.stopPropagation()
    const label = getLabelOptions(savedLabels).find(
      label => label.color === ev.currentTarget.id
    )

    if ((label.name && selectedLabel.name) || inputRef.current?.value) {
      inputRef.current.value = label.name
    }
    setSelectedLabel(label)

    if (!createLabel) {
      handleCreateLabel()
    }
  }

  const handleSave = () => {
    const data = { name: labelName, color: selectedLabel.color, cardId }

    clientRequest
      .createLabel(data)
      .then(res => {
        setLabelOptions(prev =>
          prev.map(item => (item.color === res.data.color ? res.data : item))
        )

        inputRef.current.value = ""
        handleCreateLabel()
      })
      .catch(err =>
        notify({
          description: err.message,
          status: "error",
          placement: "top",
        })
      )
  }

  const handleDelete = (ev: MouseEvent) => {
    ev.stopPropagation()
    const label = getLabelOptions(savedLabels).find(
      label => label.color === selectedLabel.color
    )

    const labelId = label?.id
    if (!labelId) return
    setSelectedLabel(label)

    clientRequest
      .deleteLabel(labelId)
      .then(() => {
        setSavedLabels(prev => [...prev.filter(label => label.id !== labelId)])
        inputRef.current.value = ""
        handleCreateLabel()
      })
      .catch(err =>
        notify({
          description: err.message,
          status: "error",
          placement: "top",
        })
      )
  }

  const handleUpdateLabels = (ev: MouseEvent) => {
    if (ev.currentTarget.nodeName === "svg") return
    const label = ev.currentTarget.id

    saveCardChanges(cardId, listId, { label })
  }

  const handleCreateLabel = () => setCreateLabel(prev => !prev)

  useEffect(() => {
    const getData = () => {
      clientRequest
        .getUserCardLabels()
        .then(res => setSavedLabels(res.data))
        .catch(err =>
          notify({
            description: err.message,
            status: "error",
            placement: "top",
          })
        )
    }

    getData()

    return () => {
      setSelectedLabel({} as ILabelProps)
      setSavedLabels([])
      inputRef.current = null
    }
  }, [])

  return (
    <CardActionStyles>
      {createLabel ? (
        <>
          {selectedLabel?.color !== undefined && (
            <Input
              size="sm"
              onChange={handleChange}
              defaultValue={selectedLabel?.name}
              placeholder="Label name"
              ref={inputRef}
            />
          )}

          <h4>Select a color</h4>

          <ul className="confirm-label">
            {LABEL_DEFAULT_OPTIONS.map((label, index) => (
              <StyledLi
                className="item-selected"
                key={index}
                bgColor={label.color}
                id={label.color}
                onClick={handleSelectedLabel}
                checked={selectedLabel?.color === label.color}
              >
                <span className="label-color">
                  <span className="check-icon">
                    <BsCheck size={20} />
                  </span>
                </span>
              </StyledLi>
            ))}
          </ul>
          <div className="button-group">
            <Button onClick={handleSave} size="sm" colorScheme="blue">
              Save
            </Button>
            {savedLabels.some(
              label => label.color === selectedLabel?.color
            ) && (
              <Button onClick={handleDelete} size="sm" colorScheme="red">
                Delete
              </Button>
            )}

            {showCancelButton && (
              <Button onClick={handleCreateLabel} size="sm" colorScheme="gray">
                Cancel
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <h4>Labels</h4>
          <ul className="pick-label">
            {labelOptions.map((label, index) => (
              <StyledLi
                id={label.color}
                onClick={handleUpdateLabels}
                className="item"
                key={index}
                bgColor={label.color}
                checked={card.labels.includes(label.color)}
              >
                <span className="label-color">
                  <span className="saved-label-name">{label.name}</span>
                  <span className="check-icon">
                    <BsCheck />
                  </span>
                </span>
                <a href="#">
                  <FiEdit2
                    id={label.color}
                    name={label?.name}
                    onClick={handleSelectedLabel}
                  />
                </a>
              </StyledLi>
            ))}
          </ul>
          <Divider className="divider" />

          <Button
            isFullWidth
            onClick={handleCreateLabel}
            size="sm"
            colorScheme="gray"
          >
            Create a new label
          </Button>
        </>
      )}
    </CardActionStyles>
  )
}

export default CardLabels
