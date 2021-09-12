import { useMemo } from "react"
import styled from "styled-components"

import ConnectedDevices from "./ConnectedDevices"
import ControlButtons from "./ControlButtons"
import CurrentlyPlaying from "./CurrentlyPlaying"
import ProgressTracker from "./ProgressTracker"

const Container = styled.div`
  max-width: 300px;
  .device-options {
    min-height: 300px;
    display: grid;
    gap: 10px;
    margin-top: 8px;
  }

  .reconnect-btn {
    position: absolute;
    top: 2px;
    right: 1px;
  }
`

const SpotifyPlayer = () => {
  return (
    <Container>
      <ConnectedDevices />
      <div className="device-options">
        <CurrentlyPlaying />
        <ControlButtons />
      </div>
    </Container>
  )
}

export default SpotifyPlayer
