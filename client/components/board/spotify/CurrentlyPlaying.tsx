import { useEffect, useState } from "react"
import styled from "styled-components"

import { clientRequest } from "../../../api"
import { useSpotify } from "../../../lib/providers"
import ControlButtons from "./ControlButtons"

const Container = styled.div<{ cover: string }>`
  .track-cover {
    background-image: url("${props => props.cover}");
    height: 230px;
    margin-bottom: 8px;
    width: 100%;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
  }
`

const CurrentlyPlaying = () => {
  const {
    setIsPlaying,
    setCurrentTrack,
    currentTrack,
    isPlaying,
    changedTrack,
    hasActiveTrack,
  } = useSpotify()

  useEffect(() => {
    if (isPlaying || hasActiveTrack) return
    const getData = () => {
      clientRequest
        .getCurrentlyPlaying()
        .then(res => {
          setCurrentTrack(res.data)
          setIsPlaying(res.data.is_playing)
        })
        .catch(err => null)
    }
    getData()
  }, [isPlaying, changedTrack, hasActiveTrack])

  return (
    <Container cover={currentTrack?.item?.images?.[1]?.url}>
      <div className="content">
        <div className="track-cover" />
        <h4>{currentTrack?.item?.name}</h4>
      </div>
    </Container>
  )
}

export default CurrentlyPlaying
