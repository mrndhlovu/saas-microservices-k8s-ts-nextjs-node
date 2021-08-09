import { Request, Response } from "express"

import {
  AccountOptions,
  AccountStatus,
  BadRequestError,
  IJwtAuthToken,
} from "@tusksui/shared"

import { allowedAccountUpdateFields } from "../utils/constants"
import { accountService } from "../services/account"
import Account, { IAccountDocument } from "../models/Account"
import { AccountCreatedPublisher } from "../events/publishers/account-created"
import { natsService } from "../services"
import { AccountUpdatedPublisher } from "../events/publishers"

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
