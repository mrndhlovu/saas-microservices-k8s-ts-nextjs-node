import { createContext, MouseEvent, useContext, useState } from "react"

import { ISpotifyDevice } from "../../components/board/spotify/ConnectedDevices"
import { usePrevious } from "../hooks"

export interface CurrentlyPlayingObject {
  item: {
    name: string
    preview_url: string
    duration_ms: number
    [key: string]: any
  }
  [key: string]: any
}

const SpotifyContextProvider = ({ children }) => {
  const [activeDevice, setActiveDevice] = useState<ISpotifyDevice | undefined>()

  const [currentTrack, setCurrentTrack] = useState<
    CurrentlyPlayingObject | undefined
  >()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const previous = usePrevious({
    trackId: currentTrack?.item?.id,
    deviceId: activeDevice?.id,
  })

  const hasActiveTrack = currentTrack !== undefined
  const hasSelectedDevice = activeDevice !== undefined
  const changedTrack = previous?.trackId !== currentTrack?.item?.id
  const switchedDevices = previous?.deviceId !== activeDevice?.id

  const canPlay = hasActiveTrack && hasSelectedDevice && !isPlaying

  const toggleIsPlaying = () => setIsPlaying(prev => !prev)

  return (
    <SpotifyContext.Provider
      value={{
        activeDevice,
        canPlay,
        changedTrack,
        currentTrack,
        hasActiveTrack,
        hasSelectedDevice,
        isPlaying,
        setActiveDevice,
        setCurrentTrack,
        setIsPlaying,
        switchedDevices,
        toggleIsPlaying,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  )
}

interface ISpotifyContext {
  activeDevice: ISpotifyDevice
  canPlay: boolean
  currentTrack: CurrentlyPlayingObject
  hasActiveTrack: boolean
  hasSelectedDevice: boolean
  isPlaying: boolean
  setActiveDevice: (device: ISpotifyDevice) => void
  setCurrentTrack: (newTrack: CurrentlyPlayingObject) => void
  setIsPlaying: (prevState: boolean) => void
  changedTrack: boolean
  switchedDevices: boolean
  toggleIsPlaying: () => void
}

export const SpotifyContext = createContext<ISpotifyContext>(
  {} as ISpotifyContext
)
export const useSpotify = () => useContext(SpotifyContext)

export { SpotifyContextProvider }
