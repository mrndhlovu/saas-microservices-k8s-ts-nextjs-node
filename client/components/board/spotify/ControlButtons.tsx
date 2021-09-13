import styled from "styled-components"
import { MouseEventHandler, useRef, useState } from "react"

import { MdForward10, MdReplay10 } from "react-icons/md"
import { BiPlayCircle, BiPauseCircle } from "react-icons/bi"
import { IoIosSkipForward, IoIosSkipBackward } from "react-icons/io"
import { ButtonGroup } from "@chakra-ui/button"

import { clientRequest } from "../../../api"
import { useGlobalState } from "../../../lib/hooks/context"
import { useSpotify } from "../../../lib/providers"
import ProgressTracker from "./ProgressTracker"

const ControlContainer = styled.div`
  width: 100%;

  .control-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .progress-tracker {
    padding: 0 10px;
    display: grid;
    grid-template-columns: 0.5fr 3fr 0.5fr;
    align-items: center;
    gap: 3px;

    .progress-time {
      span {
        font-size: 10px;
        font-weight: 600;
        min-width: 5px;
      }
    }

    .progress-time.current {
      display: flex;
      place-content: flex-end;
      gap: 2px;
      width: 100%;
      text-align: end;
    }
  }

  svg {
    cursor: pointer;
  }
`

const ControlButtons = () => {
  const {
    isPlaying,
    toggleIsPlaying,
    activeDevice,
    setIsPlaying,
    setCurrentTrack,
  } = useSpotify()

  const { notify } = useGlobalState()

  const [progress, setProgress] = useState<number>(0)

  const modifyPlaybackState = (ev: any) => {
    if (!activeDevice?.id) {
      return notify({
        description: "Select  a device",
        placement: "top-right",
      })
    }
    const [selectedButtonId, seekBack] = ev.currentTarget.id.split("|")
    const seekPos = seekBack ? progress - 10000 : progress + 10000

    const seekPosition =
      selectedButtonId === "seek"
        ? {
            seek: seekPos,
          }
        : {}

    if (selectedButtonId === "seek") {
      setProgress(seekPos)
    }

    if (selectedButtonId === "play" || selectedButtonId === "pause") {
      toggleIsPlaying()
    }

    if (selectedButtonId === "next" || selectedButtonId === "previous") {
      setIsPlaying(false)
      setCurrentTrack(undefined)
    }

    clientRequest
      .spotifyModifyPlayback({
        state: selectedButtonId,
        deviceId: activeDevice.id,
        ...seekPosition,
      })
      .catch(err => {})
      .finally(() => {
        if (selectedButtonId === "seek") {
          setIsPlaying(true)
        }
      })
  }

  return (
    <ControlContainer>
      <ButtonGroup className="control-buttons">
        <IoIosSkipBackward size={18} id="previous" />
        <MdReplay10 id="seek|back" size={15} onClick={modifyPlaybackState} />
        {!isPlaying ? (
          <BiPlayCircle size={25} id="play" onClick={modifyPlaybackState} />
        ) : (
          <BiPauseCircle size={25} id="pause" onClick={modifyPlaybackState} />
        )}

        <MdForward10 id="seek" size={15} onClick={modifyPlaybackState} />
        <IoIosSkipForward onClick={modifyPlaybackState} size={18} id="next" />
      </ButtonGroup>
      <ProgressTracker progress={progress} setProgress={setProgress} />
    </ControlContainer>
  )
}

export default ControlButtons
