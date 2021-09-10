import axios from "axios"
import PowerUp, { IPowerUpDocument } from "../models/Powerup"
import qs from "qs"
import { BadRequestError, NotAuthorisedError } from "@tusksui/shared"

class SpotifyServices {
  private scopes =
    "user-read-email playlist-modify-private playlist-read-private user-read-playback-state"
  private authEndpoint = "https://accounts.spotify.com/api/token"

  findPowerUpOnlyByUseId = async (userId: string) => {
    const powerUp = await PowerUp.findOne({ ownerId: userId })
    return powerUp
  }

  findPowerUpOnlyById = async (_id: string) => {
    const powerUp = await PowerUp.findOne({ _id })
    return powerUp
  }

  async getAuthTokens(code: string) {
    const params = new URLSearchParams()
    params.append("client_id", process.env.SPOTIFY_ID!)
    params.append("client_secret", process.env.SPOTIFY_SECRET!)
    params.append("redirect_uri", process.env.SPOTIFY_REDIRECT_URI!)
    params.append("code", code)
    params.append("grant_type", "authorization_code")

    const response = await axios
      .post(this.authEndpoint, params, {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      })
      .then(res => res?.data)
      .catch(err => err?.response?.data)

    if (!response.access_token)
      throw new NotAuthorisedError(response?.error_description)

    return response
  }
}

export const spotifyService = new SpotifyServices()
