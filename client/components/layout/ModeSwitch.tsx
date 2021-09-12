import React from "react"
import styled from "styled-components"

import { BsMoon, BsSun } from "react-icons/bs"

import { useGlobalState } from "../../lib/hooks/context"

const Container = styled.div`
  z-index: 999;
  display: flex;
  align-items: center;
  border-radius: 10px;
  position: absolute;
  bottom: 10px;
  right: 10px;

  .icon {
    svg {
      fill: ${props => props.theme.colors.border};

      & > * {
        fill: ${props => props.theme.colors.border};
      }
    }
  }

  .mode-switch-button {
    display: inline-block;
    height: 20px;
    width: 40px;
    background: ${props => props.theme.colors.border};
    border-radius: 100px;
    position: relative;
    vertical-align: middle;
    border: 0;

    &::after {
      content: "";
      position: absolute;
      left: 2px;
      top: 2px;
      height: 16px;
      width: 16px;
      border-radius: 100px;
      background: ${props => props.theme.colors.primary};
      transition: ${props => props.theme.variables.transition};
    }

    &.dark {
      &::after {
        background: ${props => props.theme.colors.amazon};
        left: 22px;
      }
    }
  }
`

const ModeSwitch = () => {
  const { darkMode, handleModeChange } = useGlobalState()

  return (
    <Container className="mode-switch">
      <span className={`icon icon-${darkMode ? "light" : "dark"}`}>
        <span>{darkMode ? <BsSun /> : <BsMoon />}</span>
      </span>
      <button
        className={darkMode ? "mode-switch-button dark" : "mode-switch-button"}
        onClick={handleModeChange}
      />
    </Container>
  )
}

export default ModeSwitch
