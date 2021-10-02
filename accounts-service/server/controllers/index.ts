import { Request, Response } from "express"
import axios from "axios"
import {
  AccountOptions,
  AccountStatus,
  ACTION_KEYS,
  ACTION_TYPES,
  BadRequestError,
  HTTPStatusCode,
  IJwtAuthToken,
  NotFoundError,
} from "@tusksui/shared"

import { AccountCreatedPublisher } from "../events/publishers/account-created"
import { accountService } from "../services/account"
import { AccountUpdatedPublisher } from "../events/publishers"
import { allowedAccountUpdateFields } from "../utils/constants"
import { natsService } from "../services"
import { spotifyService } from "../services/spotify"
import Account, { IAccountDocument } from "../models/Account"
import PowerUp, { IPowerUpDocument } from "../models/Powerup"
import Action from "../models/Action"

declare global {
  namespace Express {
    interface Request {
      account: IAccountDocument | null | undefined
      currentUserJwt: IJwtAuthToken
      powerUp: IPowerUpDocument
    }
  }
}

class AccountController {
  getAccounts = async (req: Request, res: Response) => {
    const accounts = await Account.find({})

    res.send(accounts)
  }

  async getActionByAttachmentId(req: Request, res: Response) {
    const attachmentIds = (req.query.attachmentIds as string).split("|")

    const actions = await Action.find({
      "entities.attachment.id": [...attachmentIds],
      "entities.boardId": req.params?.boardId,
    })

    res.send(actions)
  }

  getActions = async (req: Request, res: Response) => {
    const actions = await Action.find({
      "memberCreator.id": req.currentUserJwt.userId,
      "entities.boardId": req.params?.boardId,
    })

    res.send(actions)
  }

  async comment(req: Request, res: Response) {
    const action = new Action({
      entities: {
        boardId: req.body.boardId,
        comment: {
          text: req.body.comment,
          parentId: req.body?.parentId,
        },
      },
      memberCreator: {
        username: req.body.username,
        id: req.currentUserJwt.userId,
        fullName: req.body.fullName,
        initials: req.body.initials,
      },
      type: ACTION_TYPES.COMMENT,
      translationKey: ACTION_KEYS.COMMENT_ON_CARD,
    })

    await action.save()

    res.send(action)
  }

  async updateComment(req: Request, res: Response) {
    const action = await Action.findByIdAndUpdate(
      req.body.commentId,
      {
        $set: { "entities.comment": { text: req.body.comment, edited: true } },
      },
      { new: true }
    )

    if (!action) throw new NotFoundError("Action not found")

    await action.save()

    res.send(action)
  }

  async deleteComment(req: Request, res: Response) {
    const action = await Action.findById(req.params.commentId)

    if (!action) throw new NotFoundError("Action not found")

    await action.delete()

    res.status(HTTPStatusCode.NoContent).send()
  }

  getAccountById = async (req: Request, res: Response) => {
    res.send(req.account)
  }

  async getPowerUp(req: Request, res: Response) {
    const powerUps = await PowerUp.find({ ownerId: req.currentUserJwt.userId })

    res.send(powerUps)
  }

  async getRedirectUrl(req: Request, res: Response) {
    const { state, scopes } = req.query
    const url = spotifyService.getAuthUrl(
      (scopes as string).split("|"),
      state as string
    )
    res.send({ url })
  }

  async getSpotifyDevices(req: Request, res: Response) {
    const devices = await spotifyService.getUserDevices({
      ...req.spotifyApiOptions,
    })

    res.send(devices)
  }

  async getUsePlaylists(req: Request, res: Response) {
    const list = await spotifyService.getUsePlaylists({
      ...req.spotifyApiOptions,
      limit: req.query.limit! as string,
      offset: req.query.offset! as string,
    })

    res.send(list)
  }

  async getCurrentlyPlaying(req: Request, res: Response) {
    const track = await spotifyService.getCurrentlyPlaying({
      ...req.spotifyApiOptions,
    })

    res.send(track)
  }

  async modifyPlayback(req: Request, res: Response) {
    const devices = await spotifyService.modifyPlayback({
      ...req.spotifyApiOptions,
      ...req.body,
    })

    res.send(devices)
  }

  async selectPlayer(req: Request, res: Response) {
    await spotifyService.selectPlayer({
      ...req.spotifyApiOptions,
      ...req.body,
    })

    res.send()
  }

  connectSpotify = async (req: Request, res: Response) => {
    const account = await accountService.findAccountOnlyByUseId(
      req.currentUserJwt.userId!
    )
    if (!account) throw new NotFoundError()

    const response = await spotifyService.getAccessTokens(
      req.query.code as string
    )

    const tokens = {
      accessToken: response?.access_token,
      refreshToken: response?.refresh_token,
    }

    let powerUp: IPowerUpDocument

    const existingPowerUp = await accountService.findPowerUpByUseIdAndName(
      req.currentUserJwt.userId!,
      "spotify"
    )

    if (existingPowerUp) {
      powerUp = existingPowerUp

      const updatedPowerUp = await PowerUp.findOneAndUpdate(
        { _id: existingPowerUp._id },
        {
          $set: {
            tokens: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            },
            status: AccountStatus.Active,
          },
        },
        { new: true }
      )

      powerUp = updatedPowerUp!
    } else {
      powerUp = new PowerUp({
        ownerId: req?.currentUserJwt.userId,
        tokens,
        name: "spotify",
        status: "active",
      })
      account.powerUps.push(powerUp._id)
      await account.save()
    }

    await powerUp.save()

    const populatedAccount =
      await accountService.findAccountOnlyByUseIdPopulated(
        req.currentUserJwt.userId!
      )

    const eventData = accountService.getEventData(populatedAccount)

    new AccountUpdatedPublisher(natsService.client).publish(eventData)

    res.status(HTTPStatusCode.OK).send()
  }

  async revokeSpotifyAccess(req: Request, res: Response) {
    const account = await accountService.findAccountOnlyByUseId(
      req.currentUserJwt.userId!
    )
    if (!account) throw new NotFoundError()

    const powerUp = await accountService.findPowerUpOnlyById(
      req.params?.powerUpId!
    )
    if (!powerUp) throw new NotFoundError()

    powerUp.status = AccountStatus.Cancelled
    powerUp.tokens = { accessToken: "", refreshToken: "" }
    await powerUp.save()

    await account.save()

    const populatedAccount =
      await accountService.findAccountOnlyByUseIdPopulated(
        req.currentUserJwt.userId!
      )

    const eventData = accountService.getEventData(populatedAccount)

    new AccountUpdatedPublisher(natsService.client).publish(eventData)

    res.send(powerUp)
  }

  createAccount = async (_req: Request, res: Response) => {
    const account = new Account({
      status: AccountStatus.Created,
      plan: AccountOptions.Free,
    })

    await account.save()

    const eventData = accountService.getEventData(account)

    new AccountCreatedPublisher(natsService.client).publish(eventData)

    res.status(201).send(account)
  }

  verifyAccount = async (req: Request, res: Response) => {
    const isVerified =
      req.account!._id !== undefined || req.account!._id !== null

    const updatedRecord = await Account.findOneAndUpdate(
      { _id: req.account!._id },
      { $set: { isVerified, status: AccountStatus.Active } },
      { new: true }
    )

    if (updatedRecord) {
      await updatedRecord.save()

      const eventData = accountService.getEventData(updatedRecord)
      eventData.email = req.currentUserJwt.email

      new AccountUpdatedPublisher(natsService.client).publish(eventData)
      return res.status(201).send({ isVerified })
    }

    res.status(201).send({ isVerified })
  }

  updateAccount = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)

    const account = req.account!

    const hasValidFields = accountService.validateEditableFields(
      allowedAccountUpdateFields,
      updates
    )

    if (!hasValidFields) throw new BadRequestError("Invalid update field")

    const updatedRecord = await Account.findOneAndUpdate(
      { _id: account._id },
      { $set: { ...req.body } },
      { new: true }
    )

    if (req.body.isTrial) {
      accountService.addAccountExpiryDate(updatedRecord!)
    }

    await updatedRecord!.save()

    const eventData = accountService.getEventData(updatedRecord)

    new AccountUpdatedPublisher(natsService.client).publish(eventData)

    res.status(200).send(updatedRecord)
  }
}

export const accountController = new AccountController()
