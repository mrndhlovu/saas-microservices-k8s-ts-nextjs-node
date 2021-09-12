import styled from "styled-components"

import { Box, Container, SimpleGrid } from "@chakra-ui/react"

import NavSidebar from "./NavSidebar"

const StyledContainer = styled(Container)`
  position: relative;

  .main-content {
    padding-top: 70px;
    ${props => props.theme.mixins.flex("row", undefined, "flex-start")};
  }

  .sidebar {
    position: relative;
    height: 100%;
    width: 25%;
  }

  .content {
    width: 75%;
  }

  @media ${props => props.theme.device.mobileSm} {
    padding: 0;

    &::-webkit-scrollbar {
      display: none;
    }

    .layout-content {
      margin-left: 0;
      margin-right: 0;
    }
  }

  @media ${props => props.theme.device.mobileLg} {
    .content {
      width: 100%;
      padding: 0 2%;
    }

    .sidebar {
      display: none;
    }
  }
`

const SidebarLayout = ({ children }) => {
  return (
    <StyledContainer maxW="container.xl">
      <SimpleGrid spacing={5} className="main-content">
        <Box className="sidebar">
          <NavSidebar />
        </Box>
        <Box className="content">{children}</Box>
      </SimpleGrid>
    </StyledContainer>
  )
}

export default SidebarLayout
