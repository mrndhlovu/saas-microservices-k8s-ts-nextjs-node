import axios from "axios"
import SpotifyWebApi from "spotify-web-api-node"

import { BadRequestError, NotAuthorisedError } from "@tusksui/shared"
import PowerUp, { IPowerUpDocument } from "../models/Powerup"

declare global {
  namespace Express {
    interface Request {
      powerUp: IPowerUpDocument
      spotifyApiOptions: ISpotifyRequestOptions
    }
  }
}

export interface ISpotifyRequestOptions {
  accessToken: string
  powerUpId: string
  refreshToken: string
}

type RefreshTokenCallback = <T extends ISpotifyRequestOptions, Y>(
  updatedOptions: T
) => Promise<void | Y>

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_ID!,
  clientSecret: process.env.SPOTIFY_SECRET!,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
})

class SpotifyServices {
  private endPoint = "https://api.spotify.com/v1/me"

  private authHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
    }
  }

  async getAccessTokens(code: string) {
    const response = await spotifyApi.authorizationCodeGrant(code).then(
      data => data.body,
      err => {
        console.log("Something went wrong!", err.body)
        return err.body
      }
    )

    if (response.error) throw new NotAuthorisedError(response?.error)

    return response
  }

  private async refreshToken<
    T extends ISpotifyRequestOptions,
    Y extends RefreshTokenCallback
  >(options: T, callback: Y) {
    spotifyApi.setRefreshToken(options.refreshToken)

    const response = await spotifyApi.refreshAccessToken().then(
      data => {
        spotifyApi.setAccessToken(data.body["access_token"])
        return data.body
      },
      err => err.body
    )

    if (response?.error) {
      throw new NotAuthorisedError("Could not refresh access token")
    }

    const updatedPowerUp = await PowerUp.findOneAndUpdate(
      { _id: options.powerUpId },
      {
        $set: { "tokens.accessToken": response.access_token },
      }
    )
    await updatedPowerUp?.save()

    // console.log(
    //   response?.access_token,
    //   "======================",
    //   updatedPowerUp!.tokens.accessToken,
    //   "==============",
    //   options.accessToken
    // )

    await callback({
      accessToken: response.access_token,
      powerUpId: updatedPowerUp!._id.toString(),
      refreshToken: options.refreshToken,
    })
  }

  getAuthUrl(scopes: string[], state: string) {
    return spotifyApi.createAuthorizeURL(scopes, state, true)
  }

  async getUserDevices(
    options: ISpotifyRequestOptions
    // reFresh?: boolean
  ): Promise<void | SpotifyApi.UserDevicesResponse> {
    spotifyApi.setAccessToken(options.accessToken)

    return await spotifyApi
      .getMyDevices()
      .then(res => res.body)
      .catch(async err => {
        if (err?.statusCode === 401) {
          return await this.refreshToken(
            options,
            (async updatedOptions =>
              await this.getUserDevices(updatedOptions)) as RefreshTokenCallback
          )
        }
        throw new BadRequestError(err.body?.error)
      })
  }

  async getUsePlaylists<T extends ISpotifyRequestOptions>(
    options: T & {
      offset: string
      limit: string
    }
  ): Promise<void | SpotifyApi.ListOfUsersPlaylistsResponse> {
    spotifyApi.setAccessToken(options.accessToken)

    return await spotifyApi
      .getUserPlaylists({ limit: +options.limit, offset: +options.offset })
      .then(res => res.body)
      .catch(async err => {
        if (err?.statusCode === 401) {
          return await this.refreshToken(
            options,
            (async updatedOptions =>
              await this.getUsePlaylists({
                ...options,
                ...updatedOptions,
              })) as RefreshTokenCallback
          )
        }
        throw new BadRequestError(err.body?.error)
      })
  }

  async modifyPlayback<T extends ISpotifyRequestOptions>(
    options: T & {
      state: string
      deviceId: string
      seek?: number
    }
  ) {
    spotifyApi.setAccessToken(options.accessToken)

    let request: any

    switch (options.state) {
      case "pause":
        return (request = await spotifyApi.pause())

      case "next":
        return (request = await spotifyApi.skipToNext({
          device_id: options.deviceId,
        }))

      case "previous":
        return (request = await spotifyApi.skipToPrevious({
          device_id: options.deviceId,
        }))
      case "play":
        return (request = await spotifyApi.play({
          device_id: options.deviceId,
        }))

      case "seek":
        return (request = await spotifyApi.seek(options.seek!, {
          device_id: options.deviceId,
        }))

      default:
        break
    }
    if (!request) return

    request
      .then((res: any) => res.body)
      .catch(async (err: any) => {
        if (err?.statusCode === 401) {
          return await this.refreshToken(
            options,
            (async (newOptions: ISpotifyRequestOptions) =>
              await this.modifyPlayback({
                ...options,
                ...newOptions,
              })) as RefreshTokenCallback
          )
        }

        throw new BadRequestError(err.response?.data?.error?.message)
      })
  }

  async selectPlayer<T extends ISpotifyRequestOptions>(
    options: T & {
      deviceId: string
      play: boolean
    }
  ) {
    spotifyApi.setAccessToken(options.accessToken)

    const response = await spotifyApi
      .transferMyPlayback([options.deviceId], { play: options.play })
      .then(res => res)
      .catch(async err => {
        if (err?.response?.status === 401) {
          await this.refreshToken(
            options,
            async (newOptions: ISpotifyRequestOptions) =>
              await this.selectPlayer({ ...options, ...newOptions })
          )
        } else {
          return err.response
        }
      })

    console.log(response?.data)

    return response?.data
  }

  async startOrResumePlayback<T extends ISpotifyRequestOptions>(
    options: T & { deviceId: string; offset: boolean; position_ms: number }
  ) {
    const response = await spotifyApi
      .play({ position_ms: 1234333 })
      .then(res => res)
      .catch(async err => {
        if (err?.response?.status === 401) {
          await this.refreshToken(
            options,
            async (newOptions: ISpotifyRequestOptions) =>
              await this.startOrResumePlayback({ ...options, ...newOptions })
          )
        } else {
          return err.response
        }
      })

    console.log(response?.data)

    return response?.data
  }

  async getCurrentlyPlaying<T extends ISpotifyRequestOptions>(
    options: T
  ): Promise<void | SpotifyApi.CurrentlyPlayingObject> {
    return await axios
      .get(
        `${this.endPoint}/player/currently-playing?market=IE&additional_types=episode`,
        { headers: this.authHeaders(options.accessToken) }
      )
      .then(res => res.data)
      .catch(async err => {
        if (err?.response?.status === 401) {
          return await this.refreshToken(
            options,
            (async newOptions =>
              await this.getCurrentlyPlaying(
                newOptions
              )) as RefreshTokenCallback
          )
        }

        throw new BadRequestError(err.response?.data?.error?.message)
      })
  }
}

export const spotifyService = new SpotifyServices()
