import { Button } from "@chakra-ui/button"
import { FaSpotify } from "react-icons/fa"

import { useAuth } from "../../lib/hooks/context"
import { UIDropdown } from "../shared"
import SpotifyPlayer from "./spotify/SpotifyPlayer"

const PowerUpButtons = () => {
  const { user } = useAuth()
  const spotifyActive =
    user?.account.powerUps.find(item => item.name === "spotify")?.status ===
    "active"

  return (
    <>
      {spotifyActive && (
        <UIDropdown
          heading="Spotify PowerUp"
          className="spotify-menu"
          toggle={
            <span>
              <Button leftIcon={<FaSpotify size={22} />} size="sm">
                Spotify
              </Button>
            </span>
          }
        >
          <SpotifyPlayer />
        </UIDropdown>
      )}
    </>
  )
}

export default PowerUpButtons
