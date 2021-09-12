import { Button } from "@chakra-ui/button"
import { isEmpty } from "lodash"
import { AiOutlinePlus } from "react-icons/ai"
import styled from "styled-components"

import { useCardContext } from "../../../../lib/providers"
import { UIDropdown } from "../../../shared"
import CardLabels from "../cardActions/CardLabels"
import CardModule from "./CardModule"

const StyledSpan = styled.span<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  border-radius: 3px;
  box-sizing: border-box;
  display: block;
  float: left;
  font-weight: 600;
  height: 32px;
  line-height: 32px;
  margin: 0 4px 4px 0;
  min-width: 40px;
  padding: 0 12px;
  width: auto;
`

const CardLabelModule = () => {
  const { card } = useCardContext()
  const hasLabels = !isEmpty(card?.labels)

  return hasLabels ? (
    <div className="card-labels-module">
      <CardModule className="card-labels" title="Labels" />
      <div className="card-label-list module-content">
        {card?.labels.map((label: string, index: number) => (
          <div key={index}>
            <StyledSpan bgColor={label} />
          </div>
        ))}

        <UIDropdown
          heading="Labels"
          toggle={
            <Button size="md">
              <AiOutlinePlus />
            </Button>
          }
        >
          <CardLabels showCancelButton />
        </UIDropdown>
      </div>
    </div>
  ) : null
}

export default CardLabelModule
