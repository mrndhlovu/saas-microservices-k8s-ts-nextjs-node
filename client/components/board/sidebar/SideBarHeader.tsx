import styled from "styled-components"
import { IoIosArrowBack } from "react-icons/io"
import { MouseEvent } from "react"
import { AiOutlineClose } from "react-icons/ai"

const Container = styled.div<{ showBackButton: boolean }>`
  position: relative;
  display: grid;
  text-align: center;
  width: 100%;
  grid-template-columns: 0.5fr 3fr 0.5fr;
  padding: 10px 5px;
  place-items: center;

  span {
    padding: 12px 0;
    font-size: 18px;
  }

  .back-icon {
    visibility: ${props => (props.showBackButton ? "visibility" : "hidden")};
  }
`

interface IProps {
  handleBackClick: (ev: MouseEvent) => void
  handleClose: () => void
  heading: string
  backId: string
}

const SideBarHeader = ({
  heading,
  handleClose,
  handleBackClick,
  backId,
}: IProps) => {
  return (
    <Container showBackButton={backId !== undefined}>
      <div>
        <IoIosArrowBack
          className="back-icon"
          cursor="pointer"
          id={backId}
          onClick={handleBackClick}
          size={24}
        />
      </div>
      <div className="header-wrapper">
        <span>{heading}</span>
      </div>
      <div>
        <AiOutlineClose cursor="pointer" size={24} onClick={handleClose} />
      </div>
    </Container>
  )
}

export default SideBarHeader
