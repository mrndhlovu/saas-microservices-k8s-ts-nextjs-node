import { Button } from "@chakra-ui/button"
import styled from "styled-components"

const Container = styled.div<{ image: string }>`
  padding: 10px;
  width: 304px;
  cursor: pointer;
  margin: 8px 16px 8px 0;
  border-radius: 3px;
  position: relative;

  .powerup-block {
    display: grid;
    grid-template-rows: 40px auto 54px minmax(min-content, auto);
    justify-content: left;
    row-gap: 8px;
  }

  .img-icon {
    background-image: url("${props => props.image}");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 4px;
    display: inline-block;
    text-align: center;
    height: 40px;
    width: 40px;
  }

  button {
    width: max-content;
  }

  .heading {
    align-items: center;
    display: grid;
    grid-template-columns: 40px 1fr;

    .title {
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 16px;
      font-weight: bold;
      line-height: 20px;
      margin-left: 8px;
      max-height: 40px;
      text-overflow: ellipsis;
    }
  }

  small {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .description {
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #5e6c84;
    font-size: 14px;
    height: 54px;
    line-height: 18px;
    max-height: 54px;
  }

  &:hover {
    background-color: ${props => props.theme.colors.lightBgBody};
  }
`

interface IProps {
  image: string
  title: string
  isActive: boolean
  activeSince: string
  description: string
  handleConnect: () => void
  handleRevoke: () => void
  className?: string
}

const PowerUpListItem = ({
  image,
  title,
  isActive,
  activeSince,
  description,
  handleConnect,
  handleRevoke,
  className,
}: IProps) => {
  return (
    <Container image={image} className={className}>
      <div className="powerup-block">
        <div className="heading">
          <span className="img-icon" />
          <span className="title">{title}</span>
        </div>

        {isActive ? (
          <Button size="xs" onClick={handleRevoke}>
            Revoke
          </Button>
        ) : (
          <Button colorScheme="blue" size="xs" onClick={handleConnect}>
            Add
          </Button>
        )}
        {isActive && <small>Connected since: {activeSince}</small>}
        <p className="description">{description}</p>
      </div>
    </Container>
  )
}

export default PowerUpListItem
