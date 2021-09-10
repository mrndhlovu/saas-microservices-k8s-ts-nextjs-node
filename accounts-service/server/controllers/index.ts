import { Request, Response } from "express"
import axios from "axios"
import {
  AccountOptions,
  AccountStatus,
  BadRequestError,
  HTTPStatusCode,
  IJwtAuthToken,
  NotFoundError,
} from "@tusksui/shared"

import { allowedAccountUpdateFields } from "../utils/constants"
import { accountService } from "../services/account"
import Account, { IAccountDocument } from "../models/Account"
import { AccountCreatedPublisher } from "../events/publishers/account-created"
import { natsService } from "../services"
import { AccountUpdatedPublisher } from "../events/publishers"
import { spotifyService } from "../services/spotify"
import PowerUp from "../models/Powerup"

declare global {
  namespace Express {
    interface Request {
      account: IAccountDocument | null | undefined
      currentUserJwt: IJwtAuthToken
    }
  }
}

class AccountController {
  getAccounts = async (req: Request, res: Response) => {
    const accounts = await Account.find({})

    res.send(accounts)
  }

  getAccountById = async (req: Request, res: Response) => {
    res.send(req.account)
  }

  async getPowerUp(req: Request, res: Response) {
    const powerUps = await PowerUp.find({ ownerId: req.currentUserJwt.userId })

    res.send(powerUps)
  }

  connectSpotify = async (req: Request, res: Response) => {
    console.log(req.currentUserJwt)

    const account = await accountService.findAccountOnlyByUseId(
      req.currentUserJwt.userId!
    )
    if (!account) throw new NotFoundError()

    const response = await spotifyService.getAuthTokens(
      req.query.code as string
    )

    const tokens = {
      accessToken: response?.access_token,
      refreshToken: response?.refresh_token,
      scope: response?.scope,
    }

    const powerUp = new PowerUp({
      ownerId: req?.currentUserJwt.userId,
      tokens,
      name: "spotify",
      status: "active",
    })

    await powerUp.save()

    account.powerUps.push(powerUp._id)

    await account.save()
    const eventData = accountService.getEventData(account)

    new AccountUpdatedPublisher(natsService.client).publish(eventData)

    res.status(HTTPStatusCode.OK).send()
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
