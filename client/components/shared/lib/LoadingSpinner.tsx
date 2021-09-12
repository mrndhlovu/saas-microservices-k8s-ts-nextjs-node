import { Spinner } from "@chakra-ui/react"
import styled from "styled-components"

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.colors.bgLight};
  position: relative;

  .spinner {
    ${props => props.theme.styles.absoluteCenter};
    top: 40%;
  }
`

const LoadingSpinner = () => {
  return (
    <Container>
      <Spinner
        className="spinner"
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
      />
    </Container>
  )
}

export { LoadingSpinner }
