import { Router } from "express"

import { authMiddleware, errorService } from "@tusksui/shared"

import { accountController } from "../controllers"
import { accountMiddleware } from "../middleware/account"

const router = Router()

router.get(
  "/redirect",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.getRedirectUrl)
)

router.get(
  "/connect",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.connectSpotify)
)

router.get(
  "/current-playing",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  accountMiddleware.checkValidSpotifyPowerUp,
  errorService.catchAsyncError(accountController.getCurrentlyPlaying)
)

router.get(
  "/playlists",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  accountMiddleware.checkValidSpotifyPowerUp,
  errorService.catchAsyncError(accountController.getUsePlaylists)
)

router.get(
  "/:powerUpId/revoke",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.revokeSpotifyAccess)
)

router.put(
  "/modify-playback",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  accountMiddleware.checkValidSpotifyPowerUp,
  errorService.catchAsyncError(accountController.modifyPlayback)
)

router.put(
  "/select-player",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  accountMiddleware.checkValidSpotifyPowerUp,
  errorService.catchAsyncError(accountController.selectPlayer)
)

router.get(
  "/devices",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  accountMiddleware.checkValidSpotifyPowerUp,
  errorService.catchAsyncError(accountController.getSpotifyDevices)
)

export { router as spotifyRoutes }
